import ElementMap from "interface.js";

const elementmap = new ElementMap();

export function card() {
  const svgGroup = d3
    .select("body") // or select any other existing container
    .append("svg")
    .append("g");

  const card = new Map().set("expressions", new Map());

  elementmap.newElement(svgGroup, card);

  return card;
}

/**
 * Creates a tag for a card.
 * @param {Map} card - The card to be tagged.
 * @param {any} tag - The tag to be applied to the card.
 * @returns {WeakMap} A WeakMap containing the card and its tag.
 */
export function tag(card, tag) {
  return new WeakMap().set(card, tag);
}
