import Card from "./card.js";

// Does this mantain the proxy?

function cardToJSON(card) {
  // Convert the Map to an array of key-value pairs
  const mapData = Array.from(card.entries()).map(([key, value]) => {
    if (value instanceof Map || value instanceof Card) {
      return [key, cardToJSON(value)];
    } else {
      return [key, value];
    }
  });

  return {
    __type__: "Card",
    name: card.name,
    positions: Array.from(card.positions),
    transforms: Array.from(card.transforms),
    expressions: Array.from(card.expressions),
    ruleEngine: `async function ruleEngine${card.ruleEngine
      .toString()
      .slice("function".length)}`,
    mapData,
  };
}

function cardFromJSON(json) {
  // Create a new Card through the factory to ensure it has a proxy
  let card = new Card(
    json.name,
    eval(`(function() { return ${json.ruleEngine}; })()`)
  );

  json.positions.forEach((pos) => card.positions.add(pos));
  json.transforms.forEach((trans) => card.transforms.add(trans));
  json.expressions.forEach((expr) => card.expressions.add(expr));

  // Populate the Map from the array of key-value pairs
  json.mapData.forEach(([key, value]) => {
    if (value && value.__type__ === "Card") {
      card.set(key, cardFromJSON(value)); // Recursively restore Card instances
    } else {
      card.set(key, value);
    }
  });

  return card;
}

const card = new Card("testCard");
console.log("Card: ", card);

const serializedCard = JSOG.stringify(cardToJSON(card));
console.log("Serialized Card: ", serializedCard);

console.log("Thread: ", await card.thread(card));

const deserializedData = JSOG.parse(serializedCard);
const restoredCard = cardFromJSON(deserializedData);
console.log("Restored Card: ", restoredCard);
