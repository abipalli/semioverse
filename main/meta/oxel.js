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
    this.ruleEngine = ruleEngine; // this should be replaced by ruleOxel : flow cards
    this.ruleOxels = new Map();
    this.navOxels = new Map();
    this.positions = new Set();
    this.expressions = new Map();
    this.terminals = new Map(); // this is for interpretation
    this.fusable = true; // this is like whether it can be parsed using the ky
    this.story = []; // this is the event-trace
    this.messages = []; // event-queue
    this.lastEvent = undefined;
  }

  // We will want to add these methods into the map itself

  async thread(...paths) {
    //We should handle key-dives as well as backtracking navigation operations
    if (!(await this.checkRule(this, "thread", paths))) {
      throw new Error(`Call to thread is not allowed`);
    }
    let card = this;
    let initcard = card;
    for await (const path of paths) {
      if (card instanceof Map || card instanceof Oxel) {
        if (!card.has(path)) {
          card.set(path, new Oxel());
        }
        card = card.get(path);
      } else {
        console.log("map is not instanceof Map or Oxel");
        // break
      }
    }
    return initcard;
  }

  async hasThread(...paths) {
    if (!(await this.checkRule(this, "hasThread", paths))) {
      throw new Error(`Call to hasThread is not allowed`);
    }
    let card = this;
    for await (const path of paths) {
      if (card instanceof Map || card instanceof Oxel) {
        if (!card.has(path)) {
          return false;
        }
        card = card.get(path);
      } else {
        console.log("map is not instanceof Map or Oxel");
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

  async navigate(pathsOrGenerator) {
    if (!(await this.checkRule(this, "navigate", pathsOrGenerator))) {
      throw new Error(`Call to navigate is not allowed`);
    }
    let currentOxel = this;
    let previousOxel = null;
    let path = null; // Define `path` here

    const pathsIterator =
      Symbol.iterator in pathsOrGenerator
        ? pathsOrGenerator[Symbol.iterator]()
        : pathsOrGenerator;

    for await (path of pathsIterator) {
      if (path === "metaphor-dive") {
        const peek = pathsIterator.next();
        if (!peek.done && currentOxel.has(peek.value)) {
          const nextPath = peek.value;
          const nextOxel = currentOxel.get(nextPath);
          if (nextOxel instanceof Map || nextOxel instanceof Oxel) {
            previousOxel = currentOxel;
            currentOxel = nextOxel;
            path = nextPath;
          }
        }
      } else if (currentOxel.has(path)) {
        previousOxel = currentOxel;
        currentOxel = currentOxel.get(path);
      } else {
        console.log(`Failed at previousOxel: ${previousOxel} path: ${path}`);
      }
      if (previousOxel) {
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

  async shift(route1, route2) {
    if (!(await this.checkRule(this, "shift", [route1, route2]))) {
      throw new Error(`Call to shift is not allowed`);
    }

    // Navigate to the first route and save the final entry
    const navigationResult1 = await this.navigate(route1);
    if (
      navigationResult1.previousOxel &&
      navigationResult1.previousOxel.has(navigationResult1.pathTaken)
    ) {
      const originalKey = navigationResult1.pathTaken;
      const originalValue = navigationResult1.previousOxel.get(originalKey);
      navigationResult1.previousOxel.delete(originalKey);

      // Navigate to the second route and insert the saved entry
      const navigationResult2 = await this.navigate(route2);
      if (navigationResult2.currentOxel) {
        navigationResult2.currentOxel.set(originalKey, originalValue);
      }
    }
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

async function* OxelCombinator(oxel, arr, depth = arr.length) {
  const keys = Array.from(oxel.keys());

  // A helper function to generate all permutations of a given array
  async function* permutations(arr, depth = arr.length) {
    if (depth === 1) yield arr;
    else {
      for (let i = 0; i < depth; i++) {
        yield* permutations(arr, depth - 1);
        const j = depth % 2 ? 0 : i;
        [arr[j], arr[depth - 1]] = [arr[depth - 1], arr[j]];
      }
    }
  }

  for await (const perm of permutations(keys, depth)) {
    await oxel.weave(...perm);
    yield oxel;
  }
}

const scenes = new Oxel("scenes");
const roles = new Oxel("roles");
const moves = new Oxel("moves");

const players = new Oxel("players");
const player1 = new Oxel("player1");
const player2 = new Oxel("player2");
const player3 = new Oxel("player2");
const player4 = new Oxel("player2");

// Roles
const chef = new Oxel("Chef");
const cleaner = new Oxel("Cleaner");
const gardener = new Oxel("Gardener");

// Moves
const cooking = new Oxel("Cooking");
const dishwashing = new Oxel("Dish Washing");
const floorcleaning = new Oxel("Floor Cleaning");
const waterplants = new Oxel("Water Plants");
const takingouttrash = new Oxel("Taking out Trash");
const weeding = new Oxel("Weeding Plants");
const harvest = new Oxel("Harvest Crops");

await players.weave(
  [player1, roles, chef],
  [player2, roles, cleaner],
  [player3, roles, gardener],
  [player4, roles, cooking]
);

console.log("Before P1", players.get(player1).get(roles));
console.log("-----");
console.log("Before P2", players.get(player2).get(roles));

await players.shift([player1, roles, chef], [player2, roles]);

console.log("-----");
console.log("After P1", players.get(player1).get(roles));
console.log("-----");
console.log("After P2", players.get(player2).get(roles));
