export default class Oxel extends Map {
  constructor(name, value, ruleEngine = async () => true, ...args) {
    super(...args);
    this.names = new Map().set(name, new Map());
    this.values = new Map().set(value, new Map());
    this.ruleEngine = ruleEngine; // this should be made into Map
    this.positions = new Set();
    this.expressions = new Set(); // this should be made into Map
    this.messages = [];
  }

  // We will want to add these methods into the map itself?

  async thread(...paths) {
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
        throw new Error("map is not instanceof Map or Oxel");
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
    let currentOxel = this;
    let previousOxel = null;

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
          return; // would be nice to indicate where the failure occured
        }
        if (previousOxel) {
          let positions = currentOxel.positions;
          if (!positions) {
            positions = new Set();
            currentOxel.positions = positions;
          }
          // Does the pathTaken take note of the possibility of "metaphor-dive"?
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

        yield {
          previousOxel: previousOxel,
          pathTaken: path,
          currentOxel: currentOxel,
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

  // would be nice to have a conditional swap

  async checkRule(target, prop, value = null) {
    return await this.ruleEngine(target, prop, value);
  }
}
