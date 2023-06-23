import { v4 as uuid } from "uuid";

// add actorish message passing

export class Card extends Map {
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

export class InterfaceCard extends Card {
  constructor(
    layers,
    styles = [],
    animations = [],
    interactions = [],
    eventHandlers = []
  ) {
    super();
    this.set("layers", layers);
    this.set("styles", new Card(styles));
    this.set("animations", new Card(animations));
    this.set("interactions", new Card(interactions));
    this.set("eventHandlers", new Card(eventHandlers));
    this.set("expressions", new Card());
  }

  // Delete this card
  deleteCard() {
    this.get("layers").forEach((layerElement, layerName) => {
      d3.select(layerElement.node().parentNode).remove(); // Remove the SVG group
      this.get("layers").delete(layerName); // Remove the layer entry from the map
    });
    elementmap.forEach((value, key) => {
      if (value === this) {
        elementmap.delete(key);
      }
    });
  }

  renderCardGraph(elementMap) {
    this.forEach((value, key) => {
      // Create a group for each key-value pair
      const group = svg
        .append("g")
        .attr("transform", `translate(${this.x}, ${this.y})`);

      // Create a rectangle for the card
      const rect = group
        .append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", this.color);

      // Create text for the card
      const text = group
        .append("text")
        .attr("x", this.width / 2)
        .attr("y", this.height / 2)
        .attr("dy", ".35em")
        .text(`${key}: ${value}`);

      // Register the group and its children in the ElementMap
      const groupId = elementMap.newElement(group, {
        key: key,
        value: value,
      });
      elementMap.newElement(rect, { key: key, value: value });
      elementMap.newElement(text, { key: key, value: value });

      // Use groupId for element's id
      group.attr("id", groupId);
    });
  }

  addStyle(layerName, style) {
    this.get("styles").set(layerName, style);
    this.applyStyles();
  }

  addAnimation(layerName, animation) {
    this.get("animations").set(layerName, animation);
    this.applyAnimations();
  }

  // Add interaction
  addInteraction(layerName, interaction) {
    this.get("interactions").set(layerName, interaction);
  }

  // Apply interaction
  applyInteraction(layerName) {
    const interaction = this.get("interactions").get(layerName);
    if (interaction) {
      interaction(this);
    }
  }

  applyStyles() {
    this.get("layers").forEach((group, layerName) => {
      const style = this.get("styles").get(layerName);
      if (style) {
        style.applyStyle(this, group, layerName);
      }
    });
  }

  applyAnimations() {
    this.get("layers").forEach((group, layerName) => {
      const animation = this.get("animations").get(layerName);
      if (animation) {
        animation.applyAnimation(this, group, layerName);
      }
    });
  }

  // Add event handler
  addEventHandler(event, handler) {
    this.get("eventHandlers").set(event, handler);
  }

  applyInteractions() {
    const interactionMap = this.get("interactions");
    if (interactionMap) {
      for (let [layerName, interaction] of interactionMap.entries()) {
        this.applyInteraction(layerName);
      }
    }
  }

  // Apply event handlers
  applyEventHandlers() {
    const eventMap = this.get("eventHandlers");
    if (eventMap) {
      for (let [event, handler] of eventMap.entries()) {
        for (let layerElement of this.get("layers").values()) {
          layerElement.on(event, () => handler(this));
        }
      }
    }
  }
}

export class ElementMap extends Map {
  constructor() {
    super();
  }

  // Associate a new SVG element with a specific object
  newElement(svgElement, associatedObject) {
    const id = "#" + uuid();
    svgElement.attr("id", id);
    this.set(id, associatedObject);
    return id;
  }

  // Retrieve the object associated with a given SVG element
  getElementObject(svgElementId) {
    const obj = this.get(svgElementId);
    if (!obj) {
      console.log(`No object associated with SVG element ${svgElementId}`);
    }
    return obj;
  }

  // Update the object associated with a given SVG element
  updateElementObject(svgElementId, newObject) {
    if (!this.has(svgElementId)) {
      console.log(
        `No object associated with SVG element ${svgElementId} to update`
      );
    }
    this.set(svgElementId, newObject);
  }
}

class Narrative extends Card {
  constructor() {
    super();
  }
}

class InterfaceNarrative extends InterfaceCard {
  constructor() {
    super();
  }
}

class Game extends Card {
  constructor() {
    super();
  }
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

export default Card;
