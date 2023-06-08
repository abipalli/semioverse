import { v4 as uuid } from "uuid";

// add actorish message passing

export class Card extends Map {
  constructor() {
    super();
  }

  async thread(...paths) {
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (map instanceof Map || map instanceof Card) {
        if (!map.has(path)) {
          map.set(path, new Card());
        }
        map = map.get(path);
      } else {
        return console.log("map variable is not instanceof Map");
      }
    }
    return initmap;
  }

  async weave(...threads) {
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }

  async *navigate(tokens = []) {
    let currentCard = this;
    let previousCard = null;
    for await (const token of tokens) {
      if (!currentCard.has(token)) {
        return;
      }
      previousCard = currentCard;
      currentCard = currentCard.get(token);

      if (previousCard) {
        let positions = currentCard.get("positions");
        if (!positions) {
          positions = new Map();
          currentCard.set("positions", positions);
        }
        positions.set(previousCard.get("name"), previousCard);
      }

      yield currentCard;
    }
  }

  async replace(substitute, destination, ...routes) {
    for await (const route of routes) {
      for await (let map of this.navigate(route)) {
        if (map && map.has(destination)) {
          map.set(destination, new Card());
          map.get(destination).set("value", substitute);
        }
      }
    }
  }

  async *tokensGenerator(interpreter, cardgraph) {
    let currentCard = this;
    while (currentCard) {
      const interpretation = await interpreter(currentCard, cardgraph);
      if (interpretation === null || interpretation === undefined) {
        break;
      }
      yield interpretation;
    }
  }

  async *GeneratorNavigate(tokensGenerator) {
    let currentCard = this;
    let previousCard = null;

    for await (const token of await this.generatorish(tokensGenerator)) {
      try {
        if (!currentCard.has(token)) {
          console.log("Unknown token:", token);
        }
        previousCard = currentCard;
        currentCard = currentCard.get(token);
        if (previousCard) {
          let positions = currentCard.get("positions");
          if (!positions) {
            positions = new Map();
            currentCard.set("positions", positions);
          }
          positions.set(previousCard, true);
        }

        yield currentCard;
      } catch (err) {
        console.log("Generator Navigation Error: ", err);
      }
    }
  }
  // make sure we're passing in correctly
  async *reflexiveNavigate(tokensGenerator) {
    let currentCard = this;
    let nextTokensGenerator = tokensGenerator;
    for await (const token of await this.generatorish(
      nextTokensGenerator(currentCard)
    )) {
      try {
        if (!currentCard.has(token)) {
          console.log("Unknown token:", token);
        }
        currentCard = currentCard.get(token);

        yield currentCard;
        if (typeof nextTokensGenerator === "function") {
          nextTokensGenerator = await nextTokensGenerator(currentCard);
        } else {
          console.log("tokensGenerator is not a function");
        }
      } catch (err) {
        console.log("Reflexive Navigation Error: ", err);
      }
    }
  }
  async generatorish(value) {
    value = await value;
    return (
      value &&
      typeof value.next === "function" &&
      typeof value.return === "function"
    );
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

export default Card;
