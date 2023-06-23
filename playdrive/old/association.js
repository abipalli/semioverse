import { InterfaceCard } from "../../main/card";

class Card extends Map {
  constructor(name, ...args) {
    super(...args);
    this.set("name", name);
    this.set("positions", new Set());
    this.set("transforms", new Set());
  }

  async thread(...paths) {
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (map instanceof Map || Card || InterfaceCard) {
        if (Array.isArray(path)) {
          const [actualPath, rule] = path;
          if (typeof rule === "function" && !rule()) {
            continue;
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
        return console.log(
          "map is not instanceof Map || Card || InterfaceCard"
        );
      }
    }
    return initmap;
  }

  async weave(...threads) {
    // This method is used to create multiple threads.
    // It basically takes in an array of arrays, where each array represents a thread of paths to be weaved.
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }

  async *navigate(paths = []) {
    let currentCard = this;
    let previousCard = null;
    for await (const path of paths) {
      if (path === "metaphor-dive") {
        if (currentCard.has(currentCard)) {
          previousCard = currentCard;
          currentCard = currentCard.get(currentCard);

          if (previousCard) {
            let positions = currentCard.get("positions");
            if (!positions) {
              positions = new Set();
              currentCard.set("positions", positions);
            }
            positions.add(previousCard);
          }
        }
      } else if (!currentCard.has(path)) {
        return;
      } else {
        previousCard = currentCard;
        currentCard = currentCard.get(path);

        if (previousCard) {
          let positions = currentCard.get("positions");
          if (!positions) {
            positions = new Set();
            currentCard.set("positions", positions);
          }
          positions.add(previousCard);
        }
      }

      yield currentCard;
    }
  }

  async *replace(substitute, destinationkey, ...routes) {
    // This method allows for the replacement of a Card's value at a specific destination within certain routes.
    // For each route, it navigates to the destination Card, and if it finds it, it creates a new Card and sets a "value" property to the substitute provided.
    // It's important to note that this replace method doesn't actually modify the existing values, but rather it creates a new Card at the destination and assigns the substitute value to the "value" key.
    // The original keys and their associated values remain untouched. And, the destination parameter is not redundant as it serves as a way to target specific Cards in different routes.
    for await (const route of routes) {
      for await (let map of this.navigate(route)) {
        if (map && map.has(destinationkey)) {
          map.set(destinationkey, new Card());
          map.get(destinationkey).set("value", substitute);
        }
      }
    }
  }

  // Associate a transformations with this card
  linkTransform(transform) {
    /*
    This method allows a Transform to be associated with a Card. The Transform is added to the Set of "transforms" belonging to the Card. This is like saying "this Card should be able to be transformed according to these Transformations". It sets up the potential for transformation, but does not apply the transformation itself.
    */
    this.get("transforms").add(transform);
  }

  // Apply all associated transforms to this card and return the transformed cards
  transform() {
    /*
    transform(): This method applies all the Metaphors that have been linked to the Card. For each Metaphor in the Card's "transforms" Set, it invokes the applyTo method of the Metaphor, passing in the Card itself. This effectively transforms the Card according to each Metaphor. Each transformation returns a new Card, and all the resulting transformed Cards are collected into an array.
    */
    const transformedCards = [];
    for (const transform of this.get("transforms")) {
      transformedCards.push(transforms.applyTo(this));
    }
    return transformedCards;
  }

  async *pathsGenerator(interpreter, expressions) {
    // This method is a generator that interprets the expressions on the current card based on the provided interpreter function.
    let currentCard = this;
    while (currentCard) {
      const interpretation = await interpreter(currentCard, expressions);
      if (interpretation === null || interpretation === undefined) {
        break;
      }
      yield interpretation;
    }
  }

  async *GeneratorNavigate(pathsGenerator) {
    // This method is a generator that takes a paths generator and traverses a Card path based on the paths generated.
    // It also keeps track of visited cards.
    let currentCard = this;
    let previousCard = null;

    for await (const path of await this.generatorish(pathsGenerator)) {
      try {
        if (!currentCard.has(path)) {
          console.log("Unknown path:", path);
        }
        previousCard = currentCard;
        currentCard = currentCard.get(path);
        if (previousCard) {
          let positions = currentCard.get("positions");
          if (!positions) {
            positions = new Set();
            currentCard.set("positions", positions);
          }
          positions.add(previousCard);
        }

        yield currentCard;
      } catch (err) {
        console.log("Generator Navigation Error: ", err);
      }
    }
  }

  async *reflexiveNavigate(pathsGenerator) {
    // This method is another generator that navigates through a path.
    // It's called reflexive because it gets its next path from the function passed as pathsGenerator, which gets the currentCard as its argument, creating a loop that updates based on the current state of the Card.
    let currentCard = this;
    let nextTokensGenerator = pathsGenerator;
    for await (const path of await this.generatorish(
      nextTokensGenerator(currentCard)
    )) {
      try {
        if (!currentCard.has(path)) {
          console.log("Unknown path:", path);
        }
        currentCard = currentCard.get(path);

        yield currentCard;
        if (typeof nextTokensGenerator === "function") {
          nextTokensGenerator = await nextTokensGenerator(currentCard);
        } else {
          console.log("pathsGenerator is not a function");
        }
      } catch (err) {
        console.log("Reflexive Navigation Error: ", err);
      }
    }
  }
  async generatorish(value) {
    // This method is an async function that checks if a given value is a generator.
    // This is used to ensure the functions passed to GeneratorNavigate and reflexiveNavigate are actually generators.
    value = await value;
    return (
      value &&
      typeof value.next === "function" &&
      typeof value.return === "function"
    );
  }
  async *[Symbol.asyncIterator]() {
    for (const entry of this.entries()) {
      yield entry;
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

class Delegator extends Card {
  constructor(name, methodName, conditional, loopCondition, ...args) {
    super();
    this.set("name", name);
    this.set("methodName", methodName);
    this.set("conditional", conditional);
    this.set("loopCondition", loopCondition);
    this.set("args", args);
  }
}

class RunnerCard extends Card {
  constructor(name, ...args) {
    super(name, ...args);
    this.set("state", new Card().set(""));
    this.set("delegators", new Card(""));
  }

  addDelegator(delegator) {
    if (!(delegator instanceof Delegator)) {
      throw new Error("Argument is not an instance of Delegator");
    }
    this.get("delegators").set(delegator.get("name"), delegator);
  }

  async executeDelegator(delegatorName) {
    const delegator = this.get("delegators").get(delegatorName);

    if (!delegator) {
      throw new Error(`Delegator "${delegatorName}" does not exist`);
    }

    const card = this.get(delegator.methodName);
    return await this.runMethod(
      card,
      delegator.get(methodName),
      delegator.get(conditional),
      delegator.get(loopCondition),
      ...delegator.get(args)
    );
  }

  async runMethod(
    card,
    methodName,
    conditional = null,
    loopCondition = null,
    ...args
  ) {
    // Check if card has the method
    if (!card.has(methodName)) {
      throw new Error(
        `Method "${methodName}" does not exist on card "${card.get("name")}"`
      );
    }

    // Get the method
    const method = card.get(methodName);

    // Initial result
    let result;

    // If there's a conditional, use it to decide whether to run the method
    if (conditional) {
      if (conditional()) {
        result = await method(...args);
      }
    }
    // If there's a loop condition, use it to decide whether to run the method again
    else if (loopCondition) {
      do {
        result = await method(...args);
      } while (loopCondition(result));
    }
    // If there's no conditional or loop condition, just run the method
    else {
      result = await method(...args);
    }

    // Update state based on the result
    this.set(methodName, result);
    return result;
  }

  // Implementing Dynamic Execution Flow, Conditional Logic, Loops, Recursion, Dynamic Method Selection
  async runDynamicMethod(card, methodSelector, ...args) {
    // Determine the method to be executed
    const methodName =
      typeof methodSelector === "function"
        ? methodSelector(card)
        : methodSelector;

    // Check if the method exists on the card
    if (!card.has(methodName)) {
      throw new Error(
        `Method "${methodName}" does not exist on card "${card.get("name")}"`
      );
    }

    // Get the method
    const method = card.get(methodName);

    // Execute the method with the provided arguments
    const result = await method(...args);

    // Update state based on the result
    this.set(methodName, result);
    return result;
  }

  // Implementing concurrency
  async runMethodsConcurrently(cards) {
    // Execute all methods concurrently and wait for all of them to complete
    const results = await Promise.all(
      cards.map((card) => this.runAllMethods(card))
    );

    // Update state based on the results
    for (let i = 0; i < cards.length; i++) {
      this.set(cards[i].get("name"), results[i]);
    }

    return results;
  }

  // Run all methods of a card
  async runAllMethods(card) {
    // Get all methods from the card
    const methods = [...card.entries()].filter(
      ([key, value]) => typeof value === "function"
    );

    // Execute all methods and wait for all of them to complete
    const results = await Promise.all(
      methods.map(([methodName, method]) => method())
    );

    // Update state based on the results
    for (let i = 0; i < methods.length; i++) {
      this.set(methods[i][0], results[i]);
    }

    return results;
  }
}

// Delegation Delegator - which is itself a card

class EventCard extends Card {
  constructor(name, ...args) {
    super(name, ...args);
    this.set("events", new Card());
  }

  on(eventName, callback) {
    if (!this.get("events").has(eventName)) {
      this.get("events").set(eventName, []);
    }
    this.get("events").get(eventName).push(callback);
  }

  emit(eventName, ...args) {
    const listeners = this.get("events").get(eventName);
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  }
}

class EventDelegator extends Delegator {
  constructor(
    name,
    methodName,
    conditional,
    loopCondition,
    eventCard,
    ...args
  ) {
    super(name, methodName, conditional, loopCondition, ...args);
    this.set("eventCard", eventCard);
  }

  async delegate(...args) {
    const methodName = this.get("methodName");
    const eventCard = this.get("eventCard");

    if (eventCard instanceof EventCard) {
      eventCard.on(methodName, async () => {
        const result = await super.delegate(...args);
        eventCard.emit(`${methodName}:completed`, result);
      });
    } else {
      return super.delegate(...args);
    }
  }
}

// Initialize the root Card.
let rootCard = new Card("root");

// Initialize other Cards.
let card1 = new Card("card1");
let card2 = new Card("card2");

// Create the graph by linking cards.
rootCard.set("path1", card1);
rootCard.set("path2", card2);

// Define a transformation that changes a Card's name.
let transformation1 = new ConditionalTransformation(
  card1, // source
  card2, // target
  new Map([["name", "transformedName"]]), // mapping
  new Map([["name", true]]) // rules
);

// Link the transformation to card1.
card1.linkTransform(transformation1);

// Perform a transformation.
let transformedCards = card1.transform();

// Print the new name of the transformed card1.
console.log(transformedCards[0].get("transformedName")); // card1

// Now, let's cause a chain reaction by navigating the path.
let paths = ["path1", "path2"];

// Call the async navigate generator method using a for loop.
(async () => {
  for await (const card of rootCard.navigate(paths)) {
    let transformedCards = card.transform();
    transformedCards.forEach((card) =>
      console.log(card.get("transformedName"))
    );
  }
})();
