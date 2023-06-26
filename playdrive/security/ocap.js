class CardProxy {
  constructor(card) {
    return new Proxy(card, {
      get: (target, prop, receiver) => {
        if (!target.checkRule(target, prop)) {
          throw new Error(`Access to ${prop} is not allowed`);
        }
        return Reflect.get(target, prop, receiver);
      },
      set: (target, prop, value, receiver) => {
        if (!target.checkRule(target, prop, value)) {
          throw new Error(`Modification of ${prop} is not allowed`);
        }
        return Reflect.set(target, prop, value, receiver);
      },
      has: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          throw new Error(`Access to ${prop} is not allowed`);
        }
        return Reflect.has(target, prop);
      },
      deleteProperty: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          throw new Error(`Modification of ${prop} is not allowed`);
        }
        return Reflect.deleteProperty(target, prop);
      },
      ownKeys: (target) => {
        // Check with ruleEngine if obtaining ownKeys is allowed
        if (!target.checkRule(target, "ownKeys")) {
          throw new Error("Access to ownKeys is not allowed");
        }
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor: (target, prop) => {
        if (!target.checkRule(target, prop)) {
          throw new Error(`Access to ${prop} is not allowed`);
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      defineProperty: (target, prop, descriptor) => {
        if (!target.checkRule(target, prop)) {
          throw new Error(`Modification of ${prop} is not allowed`);
        }
        return Reflect.defineProperty(target, prop, descriptor);
      },
      getPrototypeOf: (target) => {
        // Check with ruleEngine if obtaining prototype is allowed
        if (!target.checkRule(target, "getPrototypeOf")) {
          throw new Error("Access to prototype is not allowed");
        }
        return Reflect.getPrototypeOf(target);
      },
      setPrototypeOf: (target, proto) => {
        // Check with ruleEngine if setting prototype is allowed
        if (!target.checkRule(target, "setPrototypeOf")) {
          throw new Error("Setting prototype is not allowed");
        }
        return Reflect.setPrototypeOf(target, proto);
      },
      isExtensible: (target) => {
        // Check with ruleEngine if checking extensibility is allowed
        if (!target.checkRule(target, "isExtensible")) {
          throw new Error("Checking extensibility is not allowed");
        }
        return Reflect.isExtensible(target);
      },
      preventExtensions: (target) => {
        // Check with ruleEngine if preventing extensions is allowed
        if (!target.checkRule(target, "preventExtensions")) {
          throw new Error("Preventing extensions is not allowed");
        }
        return Reflect.preventExtensions(target);
      },
      // Note: apply and construct traps are for function objects, and may not be applicable to the Card class, although they may be applicable to narratives.
      apply: (target, thisArg, args) => {
        if (!target.checkRule(target, "apply", args)) {
          throw new Error("Applying is not allowed");
        }
        return Reflect.apply(target, thisArg, args);
      },
      construct: (target, args) => {
        if (!target.checkRule(target, "construct", args)) {
          throw new Error("Construction is not allowed");
        }
        return Reflect.construct(target, args);
      },
    });
  }
}
