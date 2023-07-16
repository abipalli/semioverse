export default class Oxel extends Map {
  constructor(
    name,
    value,
    ruleEngine = async () => true,
    ruleOxels = Oxel,
    ...args
  ) {
    super(...args);
    this.names = new Map().set(name, new Map());
    this.values = new Map().set(value, new Map());
    this.ruleEngine = ruleEngine; // this should be replaced by ruleOxel : flow oxels
    this.ruleOxels = new Map();
    this.navOxels = new Map(navOxels);
    this.positions = new Set();
    this.expressions = new Map();
    this.terminals = new Map(); // this is for interpretation
    this.fusable = true; // this is like whether it can be parsed using the ky
    this.story = []; // this is the event-trace
    this.messages = []; // event-queue
    this.lastEvent = undefined;

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (typeof target[prop] === "function") {
          // If it's a method from the Map prototype
          if (!target.checkRule(target, prop)) {
            throw new Error(`Access to ${prop} is not allowed`);
          }

          return function (...args) {
            // Bind this to the original oxel and call the method
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

  // We will want to add these methods into the map itself

  async thread(...paths) {
    //We should handle key-dives as well as backtracking navigation operations
    if (!(await this.checkRule(this, "thread", paths))) {
      throw new Error(`Call to thread is not allowed`);
    }
    let oxel = this;
    let initoxel = oxel;
    for await (const path of paths) {
      if (oxel instanceof Map || oxel instanceof Oxel) {
        if (!oxel.has(path)) {
          oxel.set(path, new Oxel());
        }
        oxel = oxel.get(path);
      } else {
        throw new Error("map is not instanceof Map or Oxel");
        // break
      }
    }
    return initoxel;
  }

  async hasThread(...paths) {
    if (!(await this.checkRule(this, "hasThread", paths))) {
      throw new Error(`Call to hasThread is not allowed`);
    }
    let oxel = this;
    for await (const path of paths) {
      if (oxel instanceof Map || oxel instanceof Oxel) {
        if (!oxel.has(path)) {
          return false;
        }
        oxel = oxel.get(path);
      } else {
        throw new Error("map is not instanceof Map or Oxel");
      }
    }
    return true;
  }

  async weave(...threads) {
    if (!(await this.checkRule(this, "weave", threads))) {
      throw new Error(`Call to weave is not allowed`);
    }
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }

  // This accepts an array of paths
  async navigate(pathsOrGenerator) {
    if (!(await this.checkRule(this, "navigate", pathsOrGenerator))) {
      throw new Error(`Call to navigate is not allowed`);
    }
    let currentOxel = this;
    let previousOxel = null;
    let path = null;

    const pathsIterator =
      Symbol.iterator in pathsOrGenerator
        ? pathsOrGenerator[Symbol.iterator]()
        : pathsOrGenerator;

    for await (path of pathsIterator) {
      if (path === "metaphor-dive") {
        const peek = pathsIterator.next();
        if (!peek.done && currentOxel.has(peek.value)) {
          previousOxel = currentOxel;
          currentOxel = peek.value;
          path = "metaphor-dive";
        }
      } else if (currentOxel.has(path)) {
        previousOxel = currentOxel;
        currentOxel = currentOxel.get(path);
      } else {
        console.log(`Failed at previousOxel: ${previousOxel} path: ${path}`);
      }
      if (previousOxel instanceof Oxel && currentOxel instanceof Oxel) {
        let positions = currentOxel.positions;
        if (!positions) {
          positions = new Set();
          currentOxel.positions = positions;
        }
        positions.add(
          Object.freeze({ previousOxel: previousOxel, pathTaken: path })
        );

        // Cleaning up the positions set
        for (let pos of positions) {
          if (pos.previousOxel.get(pos.pathTaken) !== currentOxel) {
            positions.delete(pos);
          }
        }
      }
    }
    return {
      previousOxel: previousOxel,
      pathTaken: path,
      currentOxel: currentOxel,
    };
  }

  async swap(key, value, route) {
    if (!(await this.checkRule(this, "swap", [key, value, route]))) {
      throw new Error(`Call to swap is not allowed`);
    }

    const navigationResult = await this.navigate(route);

    if (
      navigationResult.previousOxel &&
      navigationResult.previousOxel.has(navigationResult.pathTaken)
    ) {
      // Save the original value before overwriting
      const originalValue = navigationResult.previousOxel.get(
        navigationResult.pathTaken
      );

      // Overwrite the original entry with the new key-value pair
      navigationResult.previousOxel.delete(navigationResult.pathTaken);
      navigationResult.previousOxel.set(key, value);

      // Return the original entry
      return {
        key: navigationResult.pathTaken,
        value: originalValue,
      };
    }

    // If the navigation failed, return null
    return null;
  }
  async shift(sourceRoute, destinationRoute, keys) {
    if (
      !(await this.checkRule(this, "shift", [
        sourceRoute,
        destinationRoute,
        keys,
      ]))
    ) {
      throw new Error(`Call to shift is not allowed`);
    }

    // Navigate to the source route and save the entries to be shifted
    const sourceNavigationResult = await this.navigate(sourceRoute);
    if (sourceNavigationResult.currentOxel) {
      const entriesToShift = keys.map((key) => [
        key,
        sourceNavigationResult.currentOxel.get(key),
      ]);

      // Navigate to the destination route
      const destinationNavigationResult = await this.navigate(destinationRoute);
      if (destinationNavigationResult.currentOxel) {
        // Insert the entries to be shifted into the destination oxel
        for (let [key, value] of entriesToShift) {
          destinationNavigationResult.currentOxel.set(key, value);
        }

        // Delete the shifted entries from the source oxel
        for (let key of keys) {
          sourceNavigationResult.currentOxel.delete(key);
        }
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
            result.value.previousOxel &&
            result.value.previousOxel.has(originalKey)
          ) {
            // Save the original value before overwriting
            const originalValue = result.value.previousOxel.get(originalKey);
            // Overwrite the original entry with the new key-value pair
            result.value.previousOxel.delete(originalKey);
            result.value.previousOxel.set(key, value);
            // Yield the removed entry
            yield { key: originalKey, value: originalValue };
          }
        }
        result = nextResult;
      }
    }
  }

  async fuse() {
    // this method does a rudimentary parsing by using the key-graph as a schema to label the value-graph
    let fused = new Oxel();

    for (let [key, value] of this.entries()) {
      let keyIterator = (async function* () {
        if (key instanceof Map || (key instanceof Oxel && key.fusable)) {
          for (let [k, v] of key.entries()) {
            yield { key: k, value: v };
          }
        } else {
          yield { key: key, value: value };
        }
      })();

      let valueIterator = (async function* () {
        if (value instanceof Map || (value instanceof Oxel && value.fusable)) {
          for (let [k, v] of value.entries()) {
            yield { key: k, value: v };
          }
        } else {
          yield { key: key, value: value };
        }
      })();

      for await (let keyEntry of keyIterator) {
        let valueEntry = await valueIterator.next();
        if (!valueEntry.done) {
          fused.set(
            [keyEntry.key, valueEntry.value.key],
            [keyEntry.value, valueEntry.value.value]
          );
        }
      }
    }

    return fused;
  }

  async *interpret() {
    let oxel = await this.fuse();
    // If this oxel is a terminal, get the corresponding interpretation
    if (terminals.has(oxel)) {
      const interpretation = terminals.get(oxel);
      // Yield the interpretatino
      yield interpretation;
    }
  }

  async *composeInterpreters() {
    for await (let [key, value] of this.entries()) {
      if (key instanceof Oxel && value instanceof Oxel) {
        yield* this.interpret();
      } else {
        yield { key: key, value: value };
      }
    }
  }

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

  [Symbol.asyncIterator]() {
    const entries = this.entries();
    return {
      next() {
        return new Promise((resolve) => {
          const { done, value } = entries.next();
          // You could perform some asynchronous operation here
          resolve({ done, value });
        });
      },
    };
  }
}
