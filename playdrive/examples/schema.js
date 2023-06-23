class Card extends Map {
  constructor(name, ...args) {
    super(...args);
    this.name = name;
    this.positions = new Set();
    this.transforms = new Set();
    this.expressions = new Set();
  }

  async thread(...paths) {
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (map instanceof Map || map instanceof Card) {
        if (Array.isArray(path)) {
          const [actualPath, rule] = path;
          if (typeof rule === "function" && !rule()) {
            break;
          }
          if (!map.has(actualPath)) {
            map.set(actualPath, new Card());
          }
          map = map.get(actualPath);
        } else {
          if (!map.has(path)) {
            map.set(path, new Card());
          }
          map = map.get(path);
        }
      } else {
        console.log("map is not instanceof Map or Card");
        break;
      }
    }
    return initmap;
  }

  async weave(...threads) {
    // It takes in an array of arrays, where each array represents a thread of paths to be weaved.
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }
  async *navigate(pathsOrGenerator) {
    // Handles both an iterable or an asynchronous generator
    let currentCard = this;
    let previousCard = null;

    const pathsIterator =
      Symbol.iterator in pathsOrGenerator
        ? pathsOrGenerator[Symbol.iterator]()
        : pathsOrGenerator;

    for await (let { value: path, done } of pathsIterator) {
      if (!done) {
        if (path === "metaphor-dive") {
          const peek = pathsIterator.next();
          if (!peek.done && currentCard.has(peek.value)) {
            const nextPath = peek.value;
            const nextCard = currentCard.get(nextPath);
            if (nextCard instanceof Map || nextCard instanceof Card) {
              previousCard = currentCard;
              currentCard = nextCard;
              path = nextPath;
            }
          }
        } else if (currentCard.has(path)) {
          previousCard = currentCard;
          currentCard = currentCard.get(path);
        } else {
          return;
        }

        if (previousCard) {
          let positions = currentCard.positions;
          if (!positions) {
            positions = new Set();
            currentCard.positions = positions;
          }
          positions.add(previousCard);
        }

        yield currentCard;
      }
    }
  }

  async *replace(substitute, destinationkey, ...routes) {
    for await (const route of routes) {
      let iterator = this.navigate(route); // we should ensure that route is an iterable or an async generator
      let result = await iterator.next();
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done && result.value.has(destinationkey)) {
          result.value.set(destinationkey, new Card());
          result.value.get(destinationkey).set("value", substitute);
        } else if (nextResult.done) {
          continue;
        }
        result = nextResult;
      }
    }
  }

  // Apply all associated transforms to this card and return the transformed cards
  transform() {
    //transform(): This method applies all the Transformations that have been linked to the Card. For each Transformation in the Card's "transforms" Set, it invokes the applyTo method of the Transformation, passing in the Card itself. This effectively transforms the Card according to each Transformation. Each transformation returns a new Card, and all the resulting transformed Cards are collected into an array.
    const transformedCards = [];
    for (const transform of this.transforms) {
      transformedCards.push(transform.get("applyTo")(this));
    }
    return transformedCards;
  }

  async *pathsGenerator(interpreter) {
    // This method is a generator that interprets the expressions on the current card based on the provided interpreter function.
    while (true) {
      const interpretation = await interpreter(this);
      if (interpretation === null || interpretation === undefined) {
        break;
      }
      yield interpretation;
    }
  }
}

class ConditionalTransformation extends Card {
  constructor(source, target, mapping, rules, ...args) {
    super(...args);
    this.set("source", source);
    this.set("target", target);
    this.set("mapping", mapping);
    this.set("rules", rules);
  }

  applyTo(card) {
    const source = this.get("source");
    const target = this.get("target");
    const mapping = this.get("mapping");
    const rules = this.get("rules");

    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      const newCard = new Card(target);
      for (const key of commonKeys) {
        const transformedKey = mapping.get(key);
        if (transformedKey && (!rules || rules.get(key))) {
          newCard.set(transformedKey, card.get(key));
        }
      }
      return newCard;
    }
  }
}

class ConditionalDissociation extends ConditionalTransformation {
  applyTo(card) {
    const source = this.get("source");
    const rules = this.get("rules");

    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      const newCard = new Card(card.get("name"));
      for (const key of commonKeys) {
        if (!rules || !rules.get(key)) {
          newCard.set(key, card.get(key));
        }
      }
      return newCard;
    }
  }
}

async function createSemioverse() {
  let semioverse = new Card("Semioverse");
  let elements = [
    "Function",
    "Variable",
    "Object",
    "Array",
    "Loop",
    "Control Statement",
    "Data Type",
    "Expression",
    "String",
    "Number",
    "Boolean",
  ];

  let relationships = {
    Function: ["Variable", "Control Statement"],
    Variable: ["Data Type"],
    Object: ["Function", "Variable"],
    Array: ["Data Type", "Number", "String"],
    Loop: ["Control Statement", "Variable"],
    "Control Statement": ["Boolean", "Loop"],
    "Data Type": ["Number", "String", "Boolean"],
    Expression: ["Function", "Variable", "Object", "Array"],
    String: [],
    Number: [],
    Boolean: [],
  };
  /*
      Function: Related to Variable and Control Statement. This makes sense as functions often use variables and can include control statements such as if-else or loops.
  
      Variable: Related to Data Type. This is also coherent because every variable has a data type.
  
      Object: Related to Function and Variable. In object-oriented programming, an object can have properties (variables) and methods (functions).
  
      Array: Related to Data Type, Number, and String. An array can contain elements of any data type, including numbers and strings.
  
      Loop: Related to Control Statement and Variable. Loops are a type of control statement and often interact with variables.
  
      Control Statement: Related to Boolean and Loop. Control statements often depend on boolean conditions and may include loops.
  
      Data Type: Related to Number, String, and Boolean. These are all basic data types in most programming languages.
  
      Expression: Related to Function, Variable, Object, and Array. Expressions can include any of these elements.
  
      String, Number, and Boolean: These are basic data types and do not have any specified relationships. This makes sense as these are usually the base constructs of data representation and do not inherently depend on other elements.
  
  However, note that some relationships can be added, modified, or interpreted differently depending on the specific programming language or the level of granularity one wishes to achieve. For example, functions can also be related to data types (in typed languages, every function has a return type), or arrays can also be related to variables (since an array is technically a type of variable). 
  */

  // Adding relationships to the semioverse
  for (let [element, relations] of Object.entries(relationships)) {
    for (let relation of relations) {
      await semioverse.thread(element, relation);
    }
  }

  return semioverse;
}

class OperationCard extends Card {
  constructor(name, type, data, ...args) {
    super(name, ...args);
    this.set("type", type);
    this.set("data", data);
  }

  getType() {
    return this.get("type");
  }

  getData() {
    return this.get("data");
  }
}

async function* semioverseInterpreter(semioverse, expressions) {
  for (const expr of expressions) {
    let currentCard = semioverse;

    // Each expression is a sequence of operations to perform on the semioverse
    for await (const operationCard of expr.navigate()) {
      const opType = operationCard.getType();
      const opData = operationCard.getData();

      if (opType === "navigate") {
        // Navigate operation: follow the path given by op.path
        for await (const pathCard of opData.navigate()) {
          for await (const nextCard of currentCard.navigate(
            pathCard.get("name")
          )) {
            currentCard = nextCard;
          }
        }
      } else if (opType === "replace") {
        // Replace operation: replace the value of op.key with op.value
        const keyCard = opData.get("key");
        const valueCard = opData.get("value");
        await currentCard.replace(valueCard.get("name"), keyCard.get("name"));
      } else if (opType === "thread") {
        // Thread operation: create a thread with the given paths
        const paths = [];
        for await (const pathCard of opData.navigate()) {
          paths.push(pathCard.get("name"));
        }
        await currentCard.thread(paths);
      } else if (opType === "weave") {
        // Weave operation: create multiple threads
        const threads = [];
        for await (const threadCard of opData.navigate()) {
          const thread = [];
          for await (const pathCard of threadCard.navigate()) {
            thread.push(pathCard.get("name"));
          }
          threads.push(thread);
        }
        await currentCard.weave(threads);
      } else if (opType === "transform") {
        // Transform operation: apply a transformation to the card
        for (const transformedCard of currentCard.transform()) {
          currentCard = transformedCard;
        }
      } else {
        throw new Error(`Unknown operation type: ${opType}`);
      }
    }

    // Yield the result of interpreting this expression
    yield currentCard;
  }
}

function createOperationCard(operation) {
  const { type, path, key, value, paths, threads } = operation;
  const data = new Card();

  if (path) {
    data.thread("path", ...path);
  }

  if (key && value) {
    data.thread("key", key);
    data.thread("value", value);
  }

  if (paths) {
    for (const threadPath of paths) {
      data.thread(...threadPath);
    }
  }

  if (threads) {
    for (const threadPath of threads) {
      data.weave(threadPath);
    }
  }

  return new OperationCard("Operation", type, data);
}

const semioverse = await createSemioverse();

const expressions = [
  [
    { type: "navigate", path: [["Function"], ["Variable"]] },
    { type: "replace", key: "Variable", value: "newValue" },
    { type: "thread", paths: [["Function"], ["Object"]] },
    {
      type: "weave",
      threads: [
        [["Variable"], ["Object"]],
        [["Function"], ["Array"]],
      ],
    },
  ],
  [{ type: "navigate", path: [["Object"], ["Array"]] }, { type: "transform" }],
  // More expressions...
];

for (let expr of expressions) {
  for (let i = 0; i < expr.length; i++) {
    expr[i] = createOperationCard(expr[i]);
  }
}

for await (const result of semioverseInterpreter(semioverse, expressions)) {
  console.log(result);
}
