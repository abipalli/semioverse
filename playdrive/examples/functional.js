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

function condTransformExtension(card, source, target, mapping, rules) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  // Add new properties to card
  card.set("source", source);

  card.set("target", target);
  card.set("mapping", mapping);
  card.set("rules", rules);

  // Add applyTo method to card
  card.set("applyTo", (card) => {
    const source = card.get("source");
    const target = card.get("target");
    const mapping = card.get("mapping");
    const rules = card.get("rules");

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
  });

  return card;
}

function condDissAssociatorExtension(card, source, rules) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  // Add new properties to card
  card.set("source", source);
  card.set("rules", rules);

  // Add applyTo method to card
  card.set("applyTo", (card) => {
    const source = this.get("source");
    const rules = this.get("rules");

    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      const newCard = new Card(card.name);
      for (const key of commonKeys) {
        if (!rules || !rules.get(key)) {
          newCard.set(key, card.get(key));
        }
      }
      return newCard;
    }
  });

  return card;
}

function delegatorExtension(
  card,
  methodName,
  conditional,
  loopCondition,
  ...args
) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  // Add new properties to card
  card.set("methodName", methodName);
  card.set("conditional", conditional);
  card.set("loopCondition", loopCondition);
  card.set("args", args);

  return card;
}

function eventExtension(card) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  // Add new "events" field to card
  card.weave(["events"]);

  // Add event handling methods to card
  card.set("on", (eventName, callback) => {
    if (!card.get("events").has(eventName)) {
      card.get("events").set(eventName, []);
    }
    card.get("events").get(eventName).push(callback);
  });

  card.set("emit", (eventName, ...args) => {
    const listeners = card.get("events").get(eventName);
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  });

  return card;
}

function eventDelegatorExtension(
  card,
  methodName,
  conditional,
  loopCondition,
  eventCard,
  ...args
) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  // Add new properties to card
  card = delegatorExtension(
    card,
    methodName,
    conditional,
    loopCondition,
    ...args
  );
  card.set("eventCard", eventCard);

  // Store original delegate method, if it exists
  const originalDelegate = card.get("delegate") || (() => {});

  // Override delegate method
  card.set("delegate", async (...args) => {
    const methodName = card.get("methodName");
    const eventCard = card.get("eventCard");

    if (eventCard instanceof EventCard) {
      eventCard.on(methodName, async () => {
        const result = await originalDelegate.call(card, ...args);
        eventCard.emit(`${methodName}:completed`, result);
      });
    } else {
      return originalDelegate.call(card, ...args);
    }
  });

  return card;
}

function runnerExtension(card) {
  if (!(card instanceof Card)) {
    throw new Error("Argument is not an instance of Card");
  }

  card.set("state", new Card());
  card.set("delegators", new Card());

  card.set("addDelegator", (delegator) => {
    if (!delegator.has("delegate")) {
      throw new Error("Delegator must have a 'delegate' method");
    }
    card.get("delegators").set(delegator.name, delegator);
  });

  card.set("executeDelegator", async (delegatorName) => {
    const delegator = card.get("delegators").get(delegatorName);
    if (!delegator) {
      throw new Error(`Delegator "${delegatorName}" does not exist`);
    }
    return await delegator.get("delegate")(card, delegator.get("args"));
  });
}

async function express(...threads) {
  // Input Schema: [_Source/Target/Expressions_] : [_Plaything_] : [Scenes] : [_Scene_] : [Roles] : [_Role_]: [Moves] : [_Move_]
  let expr = new Card();
  expr.thread("sources");
  expr.thread("targets");
  expr.thread("expressions");

  await expr.weave(...threads); // assuming each thread is an array, spread it as argument

  for (const key of expr.keys()) {
    if (expr.get(key) instanceof Map || expr.get(key) instanceof Card) {
      // we make the assumption that the second nested key after sources, targets, and expressions is always scenes
      // this shouldn't be a for await
      // we just get the map and get the scenes card
      // expr.get(key).get("scenes");
      // in order to get the positions set
      for await (const value of expr.navigate(key)) {
        let sceneMap = value[1].get("scenes");
        sceneMap.thread("expressions", expr);
      }
    }
  }
  console.log(expr);
  this.get("expressions");
  return expr;
}

(async () => {
  // Create the Card Universe
  let universe = new Card("Universe");
  let milkyway = new Card("Milky Way");
  let solarsystem = new Card("Solar System");
  let earth = new Card("Earth");
  let mars = new Card("Mars");

  // Create a galaxy
  await universe.thread(milkyway);

  // Create a solar system in the galaxy
  await universe.thread([milkyway, solarsystem]);

  // Create some planets in the solar system
  await universe.thread([milkyway, solarsystem, earth]);
  await universe.thread([milkyway, solarsystem, mars]);
  console.log(universe);
})();
