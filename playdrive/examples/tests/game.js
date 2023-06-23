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

const luc = new Card("Luc");
const tom = new Card("Tom");
const thierry = new Card("Thierry");
const jolly = new Card("Jolly");
const flourishnetwork = new Card("Flourish Network");

// Scenes
const bordeaux = new Card("Bordeaux");
const brondeaulalande = new Card("Brondeau Lalande");
const mainhouse = new Card("Main House");
const apartement = new Card("Apartement");
const grange = new Card("Grange");
const garage = new Card("Garage");
const garden = new Card("Garden");

// Roles
const roles = new Card("roles");
const chef = new Card("Chef");
const cleaner = new Card("Cleaner");
const gardener = new Card("Gardener");

// Moves
const cooking = new Card("Cooking");
const dishwashing = new Card("Dish Washing");
const floorcleaning = new Card("Floor Cleaning");
const waterplants = new Card("Water Plants");
const takingouttrash = new Card("Taking out Trash");
const weeding = new Card("Weeding Plants");
const harvest = new Card("Harvest Crops");

// Relationships
const memberof = new Card("member of");
const livesin = new Card("lives in");
const within = new Card("within");
const nextto = new Card("next to");
const members = new Card("members");

brondeaulaland.weave(
  [within, bordeaux],
  [members, luc],
  [members, tom],
  [members, thierry],
  [members, jolly]
);
luc.weave([livesin, mainhouse], [memberof, flourishnetwork], [roles, gardener]);
tom.weave([livesin, apartement], [memberof, flourishnetwork], [roles, chef]);
thierry.weave([livesin, mainhouse], [roles, cleaner]);
jolly.weave([livesin, mainhouse], [roles, cleaner], [roles, chef]);

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

const storyNavigator = bordeaux.navigate(randomWalk(bordeaux));

async function interpret(rootCard, rules) {
  for (const [character, role] of rules) {
    // First, find the character's current role
    const currentRole = [...character.get(roles).keys()][0];

    // Replace the character's current role with the new role
    await rootCard.replace(role, currentRole.name, [
      "members",
      character.name,
      "roles",
    ]);
  }
}
