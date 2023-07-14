import Oxel from "./oxel.js";

function condTransformExtension(card, source, target, mapping, rules) {
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
  }

  card.transforms = new Set();

  card.transform = async () => {
    if (!(await this.checkRule(this, "transform"))) {
      throw new Error(`Call to transform is not allowed`);
    }
    const transformedOxels = [];
    for (const transform of this.transforms) {
      transformedOxels.push(transform.get("applyTo")(this));
    }
    return transformedOxels;
  };

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
      const newOxel = new Oxel(target);
      for (const key of commonKeys) {
        const transformedKey = mapping.get(key);
        if (transformedKey && (!rules || rules.get(key))) {
          newOxel.set(transformedKey, card.get(key));
        }
      }
      return newOxel;
    }
  });

  return card;
}

function condDissAssociatorExtension(card, source, rules) {
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
  }

  card.transforms = new Set();

  card.transform = async () => {
    if (!(await this.checkRule(this, "transform"))) {
      throw new Error(`Call to transform is not allowed`);
    }
    const transformedOxels = [];
    for (const transform of this.transforms) {
      transformedOxels.push(transform.get("applyTo")(this));
    }
    return transformedOxels;
  };

  // Add new properties to card
  card.set("source", source);
  card.set("rules", rules);

  // Add applyTo method to card
  card.set("applyTo", (card) => {
    const source = this.get("source");
    const rules = this.get("rules");

    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      const newOxel = new Oxel(card.name);
      for (const key of commonKeys) {
        if (!rules || !rules.get(key)) {
          newOxel.set(key, card.get(key));
        }
      }
      return newOxel;
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
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
  }

  // Add new properties to card
  card.set("methodName", methodName);
  card.set("conditional", conditional);
  card.set("loopCondition", loopCondition);
  card.set("args", args);

  return card;
}

function eventExtension(card) {
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
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
  eventOxel,
  ...args
) {
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
  }

  // Add new properties to card
  card = delegatorExtension(
    card,
    methodName,
    conditional,
    loopCondition,
    ...args
  );
  card.set("eventOxel", eventOxel);

  // Store original delegate method, if it exists
  const originalDelegate = card.get("delegate") || (() => {});

  // Override delegate method
  card.set("delegate", async (...args) => {
    const methodName = card.get("methodName");
    const eventOxel = card.get("eventOxel");

    if (eventOxel instanceof EventOxel) {
      eventOxel.on(methodName, async () => {
        const result = await originalDelegate.call(card, ...args);
        eventOxel.emit(`${methodName}:completed`, result);
      });
    } else {
      return originalDelegate.call(card, ...args);
    }
  });

  return card;
}

function runnerExtension(card) {
  if (!(card instanceof Oxel)) {
    throw new Error("Argument is not an instance of Oxel");
  }

  card.set("state", new Oxel());
  card.set("delegators", new Oxel());

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
