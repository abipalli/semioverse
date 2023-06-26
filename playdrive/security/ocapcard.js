import JSOG from "jsog";

function CardFactory() {
  class Card extends Map {
    constructor(name, ruleEngineFunction = () => true, ...args) {
      super(...args);
      this.name = name;
      this.positions = new Set();
      this.transforms = new Set();
      this.expressions = new Set();
      this.ruleEngine = ruleEngineFunction;

      this.toJSON = this.toJSON.bind(this);
    }

    async thread(...paths) {
      if (!this.checkRule(this, "thread", paths)) {
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
          console.log("map is not instanceof Map or Card");
          break;
        }
      }
      return initmap;
    }

    async weave(...threads) {
      if (!this.checkRule(this, "weave", threads)) {
        throw new Error(`Call to weave is not allowed`);
      }
      for (const thread of threads) {
        await this.thread(...thread);
      }
    }
    async *navigate(pathsOrGenerator) {
      if (!this.checkRule(this, "navigate", pathsOrGenerator)) {
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
        !this.checkRule(this, "replace", [
          substitute,
          destinationkey,
          ...routes,
        ])
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

    transform() {
      if (!this.checkRule(this, "transform")) {
        throw new Error(`Call to transform is not allowed`);
      }
      const transformedCards = [];
      for (const transform of this.transforms) {
        transformedCards.push(transform.get("applyTo")(this));
      }
      return transformedCards;
    }

    async *pathsGenerator(interpreter) {
      if (!this.checkRule(this, "pathsGenerator", [interpreter])) {
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
      return this.ruleEngine(target, prop, value);
    }

    async picture(depth) {
      if (!this.checkRule(this, "picture", [depth])) {
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

    toJSON() {
      if (!this.checkRule(this, "toJSON")) {
        throw new Error(`Call to toJSON is not allowed`);
      }

      // Convert the Map to an array of key-value pairs
      const mapData = Array.from(this.entries());

      return {
        __type__: "Card",
        name: this.name,
        positions: Array.from(this.positions),
        transforms: Array.from(this.transforms),
        expressions: Array.from(this.expressions),
        ruleEngine: this.ruleEngine.toString(), // We can only save the string representation
        mapData,
      };
    }

    fromJSON(json) {
      // Create a new Card instance
      const card = new Card(json.name, eval(json.ruleEngine));
      json.positions.forEach((pos) => card.positions.add(pos));
      json.transforms.forEach((trans) => card.transforms.add(trans));
      json.expressions.forEach((expr) => card.expressions.add(expr));

      // Populate the Map from the array of key-value pairs
      json.mapData.forEach(([key, value]) => {
        if (value.__type__ === "Card") {
          card.set(key, Card.fromJSON(value)); // Recursively restore Card instances
        } else {
          card.set(key, value);
        }
      });

      return card;
    }
  }

  class CardProxy {
    constructor(card) {
      return new Proxy(card, {
        get: (target, prop, receiver) => {
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
      });
    }
  }

  return {
    createCard: (name, ruleEngineFunction = () => true, ...args) => {
      let card = new Card(name, ruleEngineFunction, ...args);
      return new CardProxy(card);
    },
  };
}

const cardFactory = CardFactory();
const card = cardFactory.createCard("testCard");
console.log(card);

// Serialize the Card
const serializedCard = JSOG.stringify(card);
console.log(serializedCard);

// Deserialize the Card
const deserializedData = JSOG.parse(serializedCard);
console.log(deserializedData);
const restoredCard = card.fromJSON(deserializedData);
console.log(restoredCard);
