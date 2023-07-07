export default class Card extends Map {
  constructor(name, value, ruleEngine = async () => true, ...args) {
    super(...args);
    this.names = new Map().set(name, new Map());
    this.values = new Map().set(value, new Map());
    this.ruleEngine = ruleEngine; // this should be made into Map
    this.positions = new Set();
    this.expressions = new Set(); // this should be made into Map
    this.messages = [];

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

  async thread(...paths) {
    if (!(await this.checkRule(this, "thread", paths))) {
      throw new Error(`Call to thread is not allowed`);
    }
    let card = this;
    let initcard = card;
    for await (const path of paths) {
      if (card instanceof Map || card instanceof Card) {
        if (!card.has(path)) {
          card.set(path, new Card());
        }
        card = card.get(path);
      } else {
        throw new Error("card is not instanceof Map or Card");
        // break
      }
    }
    return initcard;
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
          // as a reserved keyword we must make sure that it cant be used as a key elsewhere
          // possibly make the metaphor dive itself a card
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
          return; // would be nice to indicate where the failure occured
        }
        if (previousCard) {
          let positions = currentCard.positions;
          if (!positions) {
            positions = new Set();
            currentCard.positions = positions;
          }
          positions.add(
            Object.freeze({ previousCard: previousCard, pathTaken: path })
          );

          // Cleaning up the positions set
          for (let pos of positions) {
            if (pos.previousCard.get(pos.pathTaken) !== currentCard) {
              positions.delete(pos);
            }
          }
        }

        yield {
          previousCard: previousCard,
          pathTaken: path,
          currentCard: currentCard,
        };
      }
    }
  }

  async *swap(key, value, ...routes) {
    if (!(await this.checkRule(this, "swap", [key, value, ...routes]))) {
      throw new Error(`Call to swap is not allowed`);
    }

    for await (const route of routes) {
      const routeIterator =
        Symbol.iterator in route ? route[Symbol.iterator]() : route;

      let iterator = this.navigate(routeIterator);
      let result = await iterator.next();
      let originalKey;
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done) {
          originalKey = result.value.pathTaken;
          if (
            result.value.previousCard &&
            result.value.previousCard.has(originalKey)
          ) {
            // Save the original value before overwriting
            const originalValue = result.value.previousCard.get(originalKey);
            // Overwrite the original entry with the new key-value pair
            result.value.previousCard.delete(originalKey);
            result.value.previousCard.set(key, value);
            // Yield the removed entry
            yield { key: originalKey, value: originalValue };
          }
        }
        result = nextResult;
      }
    }
  }

  // Substitute Metonym : Substituting the Value
  async *substituteValue(substitute, ...routes) {
    if (
      !(await this.checkRule(this, "substituteValue", [substitute, ...routes]))
    ) {
      throw new Error(`Call to substitute is not allowed`);
    }
    for await (const route of routes) {
      const routeIterator =
        Symbol.iterator in route ? route[Symbol.iterator]() : route;
      let iterator = this.navigate(routeIterator);
      let result = await iterator.next();
      let destinationKey;
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done) {
          // Corrected this line
          destinationKey = result.value.pathTaken;
          if (result.value.currentCard.has(destinationKey)) {
            if (substitute instanceof Card) {
              result.value.currentCard.set(destinationKey, substitute);
            } else {
              result.value.currentCard
                .get(destinationKey)
                .set("value", substitute);
            }
          }
        }
        result = nextResult;
      }
    }
  }

  async *mergeCards(card1, card2) {
    for (let [key, value] of card1.entries()) {
      if (card2.has(key)) {
        const existingValue = card2.get(key);
        if (value instanceof Card && existingValue instanceof Card) {
          // If both are Cards, merge them
          yield* this.mergeCards(value, existingValue);
        } else {
          // If one isn't a Card, create a new Card with both values as keys
          // Using null as the special end-of-graph object
          const newCard = new Card();
          newCard.set(value, null);
          newCard.set(existingValue, null);
          card2.set(key, newCard);
          yield { status: "merged", key, value: newCard };
        }
      } else {
        card2.set(key, value);
        yield { status: "added", key, value };
      }
    }
  }

  // Substitue Metaphor : Substituting the Key associated with a value
  // Reassociate Value ?
  async *substituteKey(substituteKey, ...routes) {
    if (
      !(await this.checkRule(this, "substituteKey", [substituteKey, ...routes]))
    ) {
      throw new Error(`Call to substituteKey is not allowed`);
    }

    for await (const route of routes) {
      const routeIterator =
        Symbol.iterator in route ? route[Symbol.iterator]() : route;

      let iterator = this.navigate(routeIterator);
      let result = await iterator.next();
      let originalKey;
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done) {
          originalKey = result.value.pathTaken;
          if (result.value.currentCard.has(originalKey)) {
            const originalValue = result.value.currentCard.get(originalKey);

            if (result.value.currentCard.has(substituteKey)) {
              const existingValue = result.value.currentCard.get(substituteKey);

              if (
                originalValue instanceof Card &&
                existingValue instanceof Card
              ) {
                const mergeGen = this.mergeCards(originalValue, existingValue);
                let mergeNext = await mergeGen.next();
                while (!mergeNext.done) {
                  mergeNext = await mergeGen.next();
                }
                result.value.currentCard.set(substituteKey, existingValue);
              } else {
                // If one isn't a Card, create a new Card with both values as keys
                // Using null as the special end-of-graph object
                const newCard = new Card();
                newCard.set(originalValue, null);
                newCard.set(existingValue, null);
                result.value.currentCard.set(substituteKey, newCard);
              }
            } else {
              result.value.currentCard.set(substituteKey, originalValue);
            }

            result.value.currentCard.delete(originalKey);
          }
        }
        result = nextResult;
      }
    }
  }

  /*
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
          // as a reserved keyword we must make sure that it cant be used as a key elsewhere
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
          return; // would be nice to indicate where the failure occured
        }
        if (previousCard) {
          let positions = currentCard.positions;
          if (!positions) {
            positions = new Set();
            currentCard.positions = positions;
          }
          positions.add(
            Object.freeze({ previousCard: previousCard, pathTaken: path })
          );

          // Cleaning up the positions set
          for (let pos of positions) {
            if (pos.previousCard.get(pos.pathTaken) !== currentCard) {
              positions.delete(pos);
            }
          }
        }

        yield currentCard;
      }
    }
  }

  async *substitute(destinationValueSubstitute, ...routes) {
    if (
      !(await this.checkRule(this, "substitute", [
        destinationValueSubstitute,
        ...routes,
      ]))
    ) {
      throw new Error(`Call to substitute is not allowed`);
    }
    for await (const route of routes) {
      const routeIterator =
        Symbol.iterator in route ? route[Symbol.iterator]() : route;
      let iterator = this.navigate(routeIterator);
      let result = await iterator.next();
      let destinationKey;
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done) {
          destinationKey = result.value;
          if (destinationValueSubstitute instanceof Card) {
            result.value.set(destinationKey, destinationValueSubstitute);
          } else {
            result.value
              .get(destinationKey)
              .set("value", destinationValueSubstitute);
          }
        }
        result = nextResult;
      }
    }
  }

  /*
  async *substitute(destinationKey, destinationValueSubstitute, ...routes) {
    if (
      !(await this.checkRule(this, "substitute", [
        destinationKey,
        destinationValueSubstitute,
        ...routes,
      ]))
    ) {
      throw new Error(`Call to substitute is not allowed`);
    }
    for await (const route of routes) {
      const routeIterator =
        Symbol.iterator in route ? route[Symbol.iterator]() : route;
      let iterator = this.navigate(routeIterator);
      let result = await iterator.next();
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done && result.value.has(destinationKey)) {
          if (destinationValueSubstitute instanceof Card) {
            result.value.set(destinationKey, destinationValueSubstitute);
          } else {
            result.value
              .get(destinationKey)
              .set("value", destinationValueSubstitute);
          }
        } else if (nextResult.done) {
          continue;
        }
        result = nextResult;
      }
    }
  }
*/

  // Taking a snapshot of the state-play

  async snapshot(depth) {
    if (!(await this.checkRule(this, "snapshot", [depth]))) {
      throw new Error(`Call to snapshot is not allowed`);
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
  async checkRule(target, prop, value = null) {
    return await this.ruleEngine(target, prop, value);
  }
}
