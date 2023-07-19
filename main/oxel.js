export default class Oxel extends Map {
  constructor(
    name,
    value,
    ruleEngine = async () => true,
    rules = Oxel,
    ...args
  ) {
    super(...args);
    //this.names = new Map().set(name, new Map());
    this.name = name;
    this.values = new Map().set(value, new Map());
    this.ruleEngine = ruleEngine; // this should be replaced by ruleOxel : flow cards
    this.rules = rules;
    this.navOxels = new Set();
    this.positions = new Set();
    this.expressions = new Map();
    this.terminals = new Map(); // this is for interpretation
    this.fusable = true; // this is like whether it can be parsed using the key

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (typeof target[prop] === "function") {
          // If it's a method from the Map prototype
          if (!target.checkRule(target, prop)) {
            console.log(`Access to ${prop} is not allowed`);
          }

          return function (...args) {
            // Bind this to the original oxel and call the method
            return target[prop].apply(target, args);
          };
        }

        if (!target.checkRule(target, prop)) {
          console.log(`Access to ${prop} is not allowed`);
        }

        return Reflect.get(target, prop, receiver);
      },
      set: (target, prop, value, receiver) => {
        if (!target.checkRule(target, prop, value)) {
          console.log(`Modification of ${prop} is not allowed`);
        }
        return Reflect.set(target, prop, value, receiver);
      },
      has: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          console.log(`Access to ${prop} is not allowed`);
        }
        return Reflect.has(target, prop);
      },
      deleteProperty: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          console.log(`Modification of ${prop} is not allowed`);
        }
        return Reflect.deleteProperty(target, prop);
      },
      defineProperty: (target, prop, descriptor) => {
        if (!target.checkRule(target, prop)) {
          console.log(`Modification of ${prop} is not allowed`);
        }
        return Reflect.defineProperty(target, prop, descriptor);
      },
      ownKeys: (target) => {
        if (!target.checkRule(target, "ownKeys")) {
          console.log("Access to ownKeys is not allowed");
        }
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          console.log(`Access to ${prop} is not allowed`);
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      getPrototypeOf: (target) => {
        if (!target.checkRule(target, "getPrototypeOf")) {
          console.log("Access to prototype is not allowed");
        }
        return Reflect.getPrototypeOf(target);
      },
      setPrototypeOf: (target, proto) => {
        if (!target.checkRule(target, "setPrototypeOf")) {
          console.log("Setting prototype is not allowed");
        }
        return Reflect.setPrototypeOf(target, proto);
      },
      isExtensible: (target) => {
        if (!target.checkRule(target, "isExtensible")) {
          console.log("Checking extensibility is not allowed");
        }
        return Reflect.isExtensible(target);
      },
      preventExtensions: (target) => {
        if (!target.checkRule(target, "preventExtensions")) {
          console.log("Preventing extensions is not allowed");
        }
        return Reflect.preventExtensions(target);
      },
      // Note: apply and construct traps are for function objects, and may not be applicable to the Card class, although they may be applicable to narrative generator.
      apply: (target, thisArg, args) => {
        if (!target.checkRule(target, "apply", args)) {
          console.log("Applying is not allowed");
        }
        return Reflect.apply(target, thisArg, args);
      },
      construct: (target, args) => {
        if (!target.checkRule(target, "construct", args)) {
          console.log("Construction is not allowed");
        }
        return Reflect.construct(target, args);
      },
    });
  }

  //We should handle key-dives as well as backtracking navigation operations
  async thread(...paths) {
    if (!(await this.checkRule(this, "thread", paths))) {
      console.log(`Call to thread is not allowed`);
    }
    let oxel = this;
    const story = []; //so that backtracking is possible

    // this key-dive isnt functioning properly
    const pathsIterator =
      Symbol.iterator in paths ? paths[Symbol.iterator]() : paths;

    for await (const path of paths) {
      if (oxel instanceof Map || oxel instanceof Oxel) {
        if (path === "key-dive") {
          // this key-dive isnt functioning properly
          const peek = pathsIterator.next();
          //console.log("HIHIHI", peek.value);
          if (!peek.done && oxel.has(peek.value)) {
            oxel = peek.value;
          }
        }
        if (!oxel.has(path)) {
          oxel.set(path, new Oxel("Ambiguity")); // should be "undefined" but "ambiguity" is nicer to read
        }
        oxel = oxel.get(path);
        story.push(path);
      } else {
        console.log("map is not instanceof Map or Oxel");
        // break
      }
    }
    return this;
  }

  async weave(...threads) {
    if (!(await this.checkRule(this, "weave", threads))) {
      console.log(`Call to weave is not allowed`);
    }
    for (const thread of threads) {
      await this.thread(...thread);
    }
    return this;
  }

  async hasThread(...paths) {
    let oxel = this;
    // we should then also add key-dive functionality here
    for await (const path of paths) {
      if (oxel instanceof Map || oxel instanceof Oxel) {
        if (!oxel.has(path)) {
          return false;
        }
        oxel = oxel.get(path);
      } else {
        console.log("map is not instanceof Map or Oxel");
      }
    }
    return true;
  }

  async hasWeave(...threads) {
    for await (const thread of threads) {
      if (!(await this.hasThread(...thread))) {
        return false;
      }
    }
    return true;
  }

  // This accepts an array of paths
  async navigate(pathsOrGenerator) {
    if (!(await this.checkRule(this, "navigate", pathsOrGenerator))) {
      console.log(`Call to navigate is not allowed`);
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

  async shift(sourceThread, destinationThread, keys) {
    if (
      !(await this.checkRule(this, "shift", [
        sourceThread,
        destinationThread,
        keys,
      ]))
    ) {
      console.log(`Call to shift is not allowed`);
    }

    // Navigate to the source thread and save the entries to be shifted
    const sourceNavigationResult = await this.navigate(sourceThread);
    if (sourceNavigationResult.currentOxel) {
      const entriesToShift = keys.map((key) => [
        key,
        sourceNavigationResult.currentOxel.get(key),
      ]);

      // Navigate to the destination thread
      const destinationNavigationResult = await this.navigate(
        destinationThread
      );
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

  async swap(thread, key, value) {
    if (!(await this.checkRule(this, "swap", [thread, key, value]))) {
      console.log(`Call to swap is not allowed`);
    }

    const navigationResult = await this.navigate(thread);

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

  async snapshot(depth) {
    if (!(await this.checkRule(this, "snapshot", [depth]))) {
      console.log(`Call to snapshot is not allowed`);
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
        console.log("Depth cannot be less than zero");
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

const roles = new Oxel("roles");
const players = new Oxel("players");

const player1 = new Oxel("🧙 player1");
const player2 = new Oxel("🕺 player2");
const player3 = new Oxel("💃 player3");
const player4 = new Oxel("🧞‍♀️ player4");

// Roles
const chef = new Oxel("👨‍🍳 Chef");
const cleaner = new Oxel("🫧 Cleaner");
const gardener = new Oxel("🌱 Gardener");

// pathTaken is strange during navigation
player1.set("Phone Number", "+33777867213");
player2.set("Phone Number", "+33309555123");
player3.set("Phone Number", "+33567268013");

await players.weave(
  [player1, roles, chef],
  [player2, roles, cleaner],
  [player3, roles, gardener]
);

console.log("hasThread test: ", await players.hasThread(player1, roles, chef));

console.log(
  "hasWeave test: ",
  await players.hasWeave(
    [player1, roles],
    [player2, roles, cleaner],
    [player3, roles, gardener]
  )
);

//console.log(players.get(player2).get(roles));
await players.thread(player1, "key-dive", roles, chef);
console.log("Key-dive during thread test:", roles); // we should be seeing the roles card have a chef card nested within it
