import JSOG from "jsog";

// add actorish message passing?

export default class Card extends Map {
  constructor(name, ruleEngine = async () => true, ...args) {
    super(...args);
    this.name = name;
    this.positions = new Set();
    this.transforms = new Set();
    this.expressions = new Set();
    this.listeners = new Map();
    this.ruleEngine = ruleEngine; // Games

    return new Proxy(this, {
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
        if (!target.checkRule(target, "getPrototypeOf")) {
          throw new Error("Access to prototype is not allowed");
        }
        return Reflect.getPrototypeOf(target);
      },
      setPrototypeOf: (target, proto) => {
        if (!target.checkRule(target, "setPrototypeOf")) {
          throw new Error("Setting prototype is not allowed");
        }
        return Reflect.setPrototypeOf(target, proto);
      },
      isExtensible: (target) => {
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
      // Note: apply and construct traps are for function objects, and may not be applicable to the Card class, although they may be applicable to narrative generator.
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
            console.log("foseihfoseifh:", new Card());
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

  async checkRule(target, prop, value = null) {
    return await this.ruleEngine(target, prop, value);
  }

  async picture(depth) {
    if (!(await this.checkRule(this, "picture", [depth]))) {
      throw new Error(`Call to picture is not allowed`);
    }

    const hardened = new WeakSet();
    const toFreeze = new Set();
    const paths = new WeakMap();

    const enqueue = (val, path = "unknown") => {
      if (!isObject(val)) {
        // ignore primitives
        return;
      }
      const type = typeof val;
      if (type !== "object" && type !== "function") {
        // future proof: break until someone figures out what it should do
        throw TypeError(`Unexpected typeof: ${type}`);
      }
      if (hardened.has(val) || toFreeze.has(val)) {
        // Ignore if this is an exit, or we've already visited it
        return;
      }
      toFreeze.add(val);
      paths.set(val, path);
    };

    const freezeAndTraverse = (obj) => {
      // Now freeze the object to ensure reactive
      // objects such as proxies won't add properties
      // during traversal, before they get frozen.
      Object.freeze(obj);

      const path = paths.get(obj) || "unknown";
      const descs = Object.getOwnPropertyDescriptors(obj);
      const proto = Object.getPrototypeOf(obj);
      enqueue(proto, `${path}.__proto__`);

      Object.getOwnPropertyNames(descs).forEach((
        /** @type {string | symbol} */ name
      ) => {
        const pathname = `${path}.${String(name)}`;
        const desc = descs[/** @type {string} */ (name)];
        if ("value" in desc) {
          enqueue(desc.value, `${pathname}`);
        } else {
          enqueue(desc.get, `${pathname}(get)`);
          enqueue(desc.set, `${pathname}(set)`);
        }
      });
    };

    const dequeue = () => {
      toFreeze.forEach(freezeAndTraverse);
    };

    const commit = () => {
      toFreeze.forEach((value) => hardened.add(value));
    };

    const deepCopyAndFreeze = (source, depth = 0) => {
      const destination = new Card();

      if (depth < 0) {
        throw new Error("Depth cannot be less than zero");
      }

      const queue = [[source, destination, 0]];

      while (queue.length > 0) {
        const [src, dest, d] = queue.shift();

        if (d < depth) {
          for (const [key, value] of src.entries()) {
            if (value instanceof Card) {
              const childCopy = new Card();
              dest.set(key, childCopy);
              queue.push([value, childCopy, d + 1]);
              enqueue(childCopy, key);
            } else if (value && typeof value === "object") {
              const copiedValue = { ...value };
              dest.set(key, copiedValue); // This will be frozen later.
              enqueue(copiedValue, key);
            } else {
              dest.set(key, value);
            }
          }
        }
      }

      return destination;
    };

    const copy = deepCopyAndFreeze(this, depth);

    // Harden the object and its properties
    dequeue();
    commit();

    return copy;
  }
}

function cardToJSON(card) {
  // Convert the Map to an array of key-value pairs
  const mapData = Array.from(card.entries()).map(([key, value]) => {
    if (value instanceof Map || value instanceof Card) {
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
  let card = new Card(
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

const card = new Card("testCard");
console.log("Card: ", card);

const serializedCard = JSOG.stringify(cardToJSON(card));
console.log("Serialized Card: ", serializedCard);

console.log("Thread: ", await card.thread(card));

const deserializedData = JSOG.parse(serializedCard);
const restoredCard = cardFromJSON(deserializedData);
console.log("Restored Card: ", restoredCard);
