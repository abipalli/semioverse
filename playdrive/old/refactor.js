class Card extends Map {
  constructor(name, ...args) {
    super(...args);
    this.set("name", name);
    this.set("positions", new Set());
    this.set("transforms", new Set());

    // Store methods as [key, value] pairs
    this.set(
      "thread",
      async function (/* parameters */) {
        // implementation...
      }.bind(this)
    );

    this.set(
      "weave",
      async function (/* parameters */) {
        // implementation...
      }.bind(this)
    );

    this.set(
      "navigate",
      async function* (/* parameters */) {
        // implementation...
      }.bind(this)
    );

    this.set(
      "replace",
      async function* replace(substitute, destinationkey, ...routes) {
        // implementation...
      }.bind(this)
    );

    // ...and so on for other methods
  }
}

let card = new Card("card1");
card.get("thread")(/* parameters */);
