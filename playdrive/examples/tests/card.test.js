const assert = require("assert");

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

const city = new Card("City");
const forest = new Card("Forest");
const dragon = new Card("Dragon");
const princess = new Card("Princess");
const knight = new Card("Knight");
const magicSword = new Card("MagicSword");

const nextTo = new Card("MagicSword");
const captured = new Card("captured");
const contains = new Card("contains");
const beingsavedby = new Card("being saved by");
const holding = new Card("holding");

city.thread(
  nextTo,
  forest,
  contains,
  dragon,
  captured,
  princess,
  beingsavedby,
  knight,
  holding,
  magicSword
);

console.log(city);

// A simple random walk generator
async function* randomWalk(startCard) {
  let currentCard = startCard;
  while (true) {
    const paths = [...currentCard.keys()];
    const nextPath = paths[Math.floor(Math.random() * paths.length)];
    yield nextPath;
    currentCard = currentCard.get(nextPath);
  }
}

const storyNavigator = city.navigate(randomWalk(city));

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

describe("Card", () => {
  let card;

  beforeEach(() => {
    card = new Card("root");
    path1 = new Card("path1");
    path2 = new Card("path2");
    path3 = new Card("path3");
    path4 = new Card("path4");
    destination = new Card("destination");
    substitute = new Card("substitute");
  });

  describe("constructor", () => {
    it("should correctly initialize properties", () => {
      expect(card instanceof Map).toBeTruthy();
      expect(card.name).toEqual("root");
      expect(card.positions).toEqual(expect.any(Set));
      expect(card.transforms).toEqual(expect.any(Set));
      expect(card.expressions).toEqual(expect.any(Set));
    });
  });

  describe("thread method", () => {
    it("should correctly add new cards along provided paths", async () => {
      await card.thread(path1, path2);
      expect(card.get(path1)).toBeInstanceOf(Card);
      expect(card.get(path1).get(path2)).toBeInstanceOf(Card);
    });

    it("should correctly follow the provided path if it already exists", async () => {
      await card.thread(path1, path2);
      const initmap = await card.thread(path1, path2);
      expect(initmap).toEqual(card);
    });

    it("should handle case when map is not an instance of Map or Card", async () => {
      const consoleSpy = jest.spyOn(console, "log");
      await card.thread(3); // non-map non-card instance
      expect(consoleSpy).toHaveBeenCalledWith(
        "map is not instanceof Map or Card"
      );
    });
  });

  describe("weave method", () => {
    it("should correctly thread multiple paths provided in an array", async () => {
      await card.weave([path1, path2], [path3, path4]);
      expect(card.get(path1).get(path2)).toBeInstanceOf(Card);
      expect(card.get(path3).get(path4)).toBeInstanceOf(Card);
    });
  });

  describe("#navigate()", function () {
    it("should correctly navigate with different paths", async function () {
      await card.weave([path1, path2], ["metaphor-dive"]);

      let path = [path1, path2];
      let result = [];
      for await (let c of card.navigate(path)) {
        result.push(c);
      }
      assert.deepStrictEqual(result, [path1, path2]);

      path = ["metaphor-dive"];
      result = [];
      for await (let c of card.navigate(path)) {
        result.push(c);
      }
      assert.deepStrictEqual(result, [card, "root"]);

      path = ["non-existent-path"];
      result = [];
      for await (let c of card.navigate(path)) {
        result.push(c);
      }
      assert.deepStrictEqual(result, []);
    });

    it("should correctly update positions set", async function () {
      await card.weave([path1, path2], [path3]);

      const path = [path1, path2];
      let lastCard;
      for await (let c of card.navigate(path)) {
        lastCard = c;
      }
      assert(lastCard.positions.has(card.get(path1)));
    });
  });

  describe("#replace()", function () {
    it("should correctly replace the destination key with a substitute", async function () {
      await card.weave([path1, destination], [path2]);
      await card.replace(substitute, destination, [path1]);

      const path = [path1, destination];
      let lastCard;
      for await (let c of card.navigate(path)) {
        lastCard = c;
      }
      assert.strictEqual(lastCard.get("value"), substitute);
    });

    it("should do nothing when the destination key does not exist", async function () {
      await card.weave([path1], [path2]);
      await card.replace(substitute, destination, [path1]);

      const path = [path1, destination];
      let lastCard;
      for await (let c of card.navigate(path)) {
        lastCard = c;
      }
      assert.strictEqual(lastCard, undefined);
    });
  });

  describe("#linkTransform() and transform()", function () {
    it("should correctly link a transform and apply it", function () {
      const transform = new Map();
      transform.set("applyTo", (card) => {
        let newCard = new Card(card.name);
        newCard.set("transformed", true);
        return newCard;
      });
      card.linkTransform(transform);

      const transformedCards = card.transform();
      assert.strictEqual(transformedCards[0].get("transformed"), true);
    });
  });
});

/*
The following unit tests are proposed:

1. Card Constructor and Properties

    Create a Card instance and check if the instance is correctly created.
    Test that name, positions, transforms, and expressions properties are correctly initialized.

2. Card Method: thread

    Test that a Card instance correctly adds new Cards along the provided paths.
    Test that a Card instance correctly follows the provided path if it already exists.
    Test for case when the map is not an instance of Map or Card.

3. Card Method: weave

    Test that it correctly threads multiple paths provided in an array.

4. Card Method: navigate

    Test navigation with different paths, including "metaphor-dive", normal paths, and non-existent paths.
    Test that the positions set is updated correctly.

5. Card Method: replace

    Test that it correctly replaces the destination key with a substitute in the specified routes.
    Test what happens when the destination key does not exist.

6. Card Method: linkTransform and transform

    Test that the linkTransform method correctly adds to the transforms set.
    Test that the transform method correctly applies each transformation.

7. Card Method: pathsGenerator, GeneratorNavigate, reflexiveNavigate

    Test that these generator methods are working correctly, both when receiving generators and when receiving other types.

8. Extensions: condTransformExtension, condDissassociatorExtension, delegatorExtension, eventExtension, eventDelegatorExtension, runnerExtension

    Test that each extension correctly modifies a Card instance.
    Test that the applyTo methods work correctly.
    Test event handling methods (on and emit).
    Test the delegate method in the eventDelegatorExtension.
    Test the addDelegator and executeDelegator methods in the runnerExtension.
*/
