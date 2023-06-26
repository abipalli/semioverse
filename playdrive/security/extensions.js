import JSOG from "jsog";

function CardFactory() {
  class Card extends Map {
    constructor(name, ruleEngine = async () => true, cardFactory, ...args) {
      super(...args);
      this.name = name;
      this.positions = new Set();
      this.transforms = new Set();
      this.expressions = new Set();
      this.listeners = new Map();
      this.ruleEngine = ruleEngine;
      this.cardFactory = cardFactory;
    }

    /*
    //In order to automatically trigger this event whenever data in a Card changes:
    set(key, value) {
      const result = super.set(key, value);
      this.emit("change", key, value);
      return result;
    }
    */

    on(eventName, callback) {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
      }
      this.listeners.get(eventName).push(callback);
    }

    off(eventName, callback) {
      if (this.listeners.has(eventName)) {
        const eventListeners = this.listeners.get(eventName);
        this.listeners.set(
          eventName,
          eventListeners.filter((listener) => listener !== callback)
        );
      }
    }

    emit(eventName, ...args) {
      if (this.listeners.has(eventName)) {
        const eventListeners = this.listeners.get(eventName);
        for (const listener of eventListeners) {
          listener(...args);
        }
      }
    }

    async thread(...paths) {
      if (!(await this.checkRule(this, "thread", paths))) {
        throw new Error(`Call to thread is not allowed`);
      }
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
          throw new Error("map is not instanceof Map or Card");
          // break
        }
      }
      return initmap;
    }

    async weave(...threads) {
      if (!(await this.checkRule(this, "weave", threads))) {
        throw new Error(`Call to weave is not allowed`);
      }
      for (const thread of threads) {
        await this.thread(...thread);
      }
    }
    async *navigate(pathsOrGenerator) {
      if (!(await this.checkRule(this, "navigate", pathsOrGenerator))) {
        throw new Error(`Call to navigate is not allowed`);
      }
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
      if (
        !(await this.checkRule(this, "replace", [
          substitute,
          destinationkey,
          ...routes,
        ]))
      ) {
        throw new Error(`Call to replace is not allowed`);
      }
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

    async transform() {
      if (!(await this.checkRule(this, "transform"))) {
        throw new Error(`Call to transform is not allowed`);
      }
      const transformedCards = [];
      for (const transform of this.transforms) {
        transformedCards.push(transform.get("applyTo")(this));
      }
      return transformedCards;
    }

    applyExtension(extension, ...args) {
      this.extensions = new CardProxy(extension(this.extensions, ...args));
    }

    async *pathsGenerator(interpreter) {
      if (!(await this.checkRule(this, "pathsGenerator", [interpreter]))) {
        throw new Error(`Call to pathsGenerator is not allowed`);
      }
      while (true) {
        const interpretation = await interpreter(this);
        if (interpretation === null || interpretation === undefined) {
          break;
        }
        yield interpretation;
      }
    }
    async checkRule(target, prop, value = null) {
      return await this.ruleEngine(target, prop, value);
    }

    async picture(depth) {
      if (!(await this.checkRule(this, "picture", [depth]))) {
        throw new Error(`Call to picture is not allowed`);
      }

      const deepFreeze = (obj) => {
        const propNames = Object.getOwnPropertyNames(obj);
        for (const name of propNames) {
          const value = obj[name];
          if (value && typeof value === "object") {
            deepFreeze(value);
          }
        }
        return Object.freeze(obj);
      };

      const copyCard = (source) => {
        const destination = new Card();
        for (const [key, value] of source.entries()) {
          if (value instanceof Card) {
            destination.set(key, copyCard(value));
          } else if (value && typeof value === "object") {
            destination.set(key, deepFreeze({ ...value }));
          } else {
            destination.set(key, value);
          }
        }
        return destination;
      };

      const copy = new Card(this.name, this.ruleEngine);

      if (depth < 0) {
        throw new Error("Depth cannot be less than zero");
      }

      const queue = [[this, copy, 0]];

      while (queue.length > 0) {
        const [source, destination, d] = queue.shift();

        if (d < depth) {
          for (const [key, value] of source.entries()) {
            if (value instanceof Card) {
              const childCopy = copyCard(value);
              destination.set(key, childCopy);
              queue.push([value, childCopy, d + 1]);
            } else if (value && typeof value === "object") {
              destination.set(key, deepFreeze({ ...value }));
            } else {
              destination.set(key, value);
            }
          }
        }
      }

      return Object.freeze(copy);
    }
  }

  class CardProxy {
    constructor(card) {
      return new Proxy(card, {
        get: (target, prop, receiver) => {
          if (typeof target[prop] === "function") {
            // If it's a method from the Map prototype
            if (!target.checkRule(target, prop)) {
              throw new Error(`Access to ${prop} is not allowed`);
            }

            return function (...args) {
              // Bind this to the original card and call the method
              return target[prop].apply(target, args);
            };
          }

          if (!target.checkRule(target, prop)) {
            throw new Error(`Access to ${prop} is not allowed`);
          }

          if (prop === "serialize") {
            return () => JSOG.parse(target.serialize()); // Allow serialization through proxy
          }

          return Reflect.get(target, prop, receiver);
        },
        set: (target, prop, value, receiver) => {
          if (!target.checkRule(target, prop, value)) {
            throw new Error(`Modification of ${prop} is not allowed`);
          }
          return Reflect.set(target, prop, value, receiver);
        },
        has: (target, prop) => {
          if (!target.checkRule(target, prop)) {
            throw new Error(`Access to ${prop} is not allowed`);
          }
          return Reflect.has(target, prop);
        },
        deleteProperty: (target, prop) => {
          if (!target.checkRule(target, prop)) {
            throw new Error(`Modification of ${prop} is not allowed`);
          }
          return Reflect.deleteProperty(target, prop);
        },
        defineProperty: (target, prop, descriptor) => {
          if (!target.checkRule(target, prop)) {
            throw new Error(`Modification of ${prop} is not allowed`);
          }
          return Reflect.defineProperty(target, prop, descriptor);
        },
        ownKeys: (target) => {
          // Check with ruleEngine if obtaining ownKeys is allowed
          if (!target.checkRule(target, "ownKeys")) {
            throw new Error("Access to ownKeys is not allowed");
          }
          return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor: (target, prop) => {
          if (!target.checkRule(target, prop)) {
            throw new Error(`Access to ${prop} is not allowed`);
          }
          return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        getPrototypeOf: (target) => {
          // Check with ruleEngine if obtaining prototype is allowed
          if (!target.checkRule(target, "getPrototypeOf")) {
            throw new Error("Access to prototype is not allowed");
          }
          return Reflect.getPrototypeOf(target);
        },
        setPrototypeOf: (target, proto) => {
          // Check with ruleEngine if setting prototype is allowed
          if (!target.checkRule(target, "setPrototypeOf")) {
            throw new Error("Setting prototype is not allowed");
          }
          return Reflect.setPrototypeOf(target, proto);
        },
        isExtensible: (target) => {
          // Check with ruleEngine if checking extensibility is allowed
          if (!target.checkRule(target, "isExtensible")) {
            throw new Error("Checking extensibility is not allowed");
          }
          return Reflect.isExtensible(target);
        },
        preventExtensions: (target) => {
          // Check with ruleEngine if preventing extensions is allowed
          if (!target.checkRule(target, "preventExtensions")) {
            throw new Error("Preventing extensions is not allowed");
          }
          return Reflect.preventExtensions(target);
        },
        // Note: apply and construct traps are for function objects, and may not be applicable to the Card class, although they may be applicable to narratives.
        apply: (target, thisArg, args) => {
          if (!target.checkRule(target, "apply", args)) {
            throw new Error("Applying is not allowed");
          }
          return Reflect.apply(target, thisArg, args);
        },
        construct: (target, args) => {
          if (!target.checkRule(target, "construct", args)) {
            throw new Error("Construction is not allowed");
          }
          return Reflect.construct(target, args);
        },
      });
    }
  }

  return {
    createCard: (name, ruleEngine = async () => true, ...args) => {
      let card = new Card(name, ruleEngine, ...args);
      return new CardProxy(card);
    },
  };
}

function cardToJSON(card) {
  // Convert the Map to an array of key-value pairs
  const mapData = Array.from(card.entries()).map(([key, value]) => {
    if (value instanceof Map) {
      return [key, cardToJSON(value)];
    } else {
      return [key, value];
    }
  });

  return {
    __type__: "Card",
    name: card.name,
    positions: Array.from(card.positions),
    transforms: Array.from(card.transforms),
    expressions: Array.from(card.expressions),
    ruleEngine: `async function ruleEngine${card.ruleEngine
      .toString()
      .slice("function".length)}`,
    mapData,
  };
}

function cardFromJSON(json) {
  // Create a new Card through the factory to ensure it has a proxy
  let card = cardFactory.createCard(
    json.name,
    eval(`(function() { return ${json.ruleEngine}; })()`)
  );

  json.positions.forEach((pos) => card.positions.add(pos));
  json.transforms.forEach((trans) => card.transforms.add(trans));
  json.expressions.forEach((expr) => card.expressions.add(expr));

  // Populate the Map from the array of key-value pairs
  json.mapData.forEach(([key, value]) => {
    if (value && value.__type__ === "Card") {
      card.set(key, cardFromJSON(value)); // Recursively restore Card instances
    } else {
      card.set(key, value);
    }
  });

  return card;
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

const cardFactory = CardFactory();
const card = cardFactory.createCard("testCard");
console.log("Card: ", card);

const serializedCard = JSOG.stringify(cardToJSON(card)); // Uses standalone function with CardProxy
console.log("Serialized Card: ", serializedCard);

console.log("Thread: ", await card.thread(card));

const deserializedData = JSOG.parse(serializedCard);
const restoredCard = cardFromJSON(deserializedData); // Uses standalone function with CardProxy
console.log("Restored Card: ", restoredCard);
