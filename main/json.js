import Oxel from "./oxel.js";

// Does this mantain the proxy?

function oxelToJSON(oxel) {
  // Convert the Map to an array of key-value pairs
  const mapData = Array.from(oxel.entries()).map(([key, value]) => {
    if (value instanceof Map || value instanceof Oxel) {
      return [key, oxelToJSON(value)];
    } else {
      return [key, value];
    }
  });

  return {
    __type__: "Oxel",
    name: oxel.name,
    positions: Array.from(oxel.positions),
    transforms: Array.from(oxel.transforms),
    expressions: Array.from(oxel.expressions),
    ruleEngine: `async function ruleEngine${oxel.ruleEngine
      .toString()
      .slice("function".length)}`,
    mapData,
  };
}

function oxelFromJSON(json) {
  // Create a new Oxel through the factory to ensure it has a proxy
  let oxel = new Oxel(
    json.name,
    eval(`(function() { return ${json.ruleEngine}; })()`)
  );

  json.positions.forEach((pos) => oxel.positions.add(pos));
  json.transforms.forEach((trans) => oxel.transforms.add(trans));
  json.expressions.forEach((expr) => oxel.expressions.add(expr));

  // Populate the Map from the array of key-value pairs
  json.mapData.forEach(([key, value]) => {
    if (value && value.__type__ === "Oxel") {
      oxel.set(key, oxelFromJSON(value)); // Recursively restore Oxel instances
    } else {
      oxel.set(key, value);
    }
  });

  return oxel;
}

const oxel = new Oxel("testOxel");
console.log("Oxel: ", oxel);

const serializedOxel = JSOG.stringify(oxelToJSON(oxel));
console.log("Serialized Oxel: ", serializedOxel);

console.log("Thread: ", await oxel.thread(oxel));

const deserializedData = JSOG.parse(serializedOxel);
const restoredOxel = oxelFromJSON(deserializedData);
console.log("Restored Oxel: ", restoredOxel);
