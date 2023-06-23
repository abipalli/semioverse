/*
The Card class, as it stands, offers a robust framework for creating interconnected maps of objects, each carrying its own set of data and relationships. The ability to use Cards as keys signifies the potential to attribute deep, rich, and multi-faceted meanings to objects in this network. This, in turn, offers possibilities in metaphorical and semantic computing that could revolutionize natural language processing (NLP) and artificial intelligence (AI).

    Encoding of Semantic Relationships: Each Card can be seen as a unit of meaning, similar to a word or a phrase in language. Using Cards as keys to other Cards can be interpreted as encoding the semantic relationships between these units of meaning. For example, the Card representing the concept "Bird" could have a key (a Card itself) representing "Can Fly", pointing to a value that encodes how this property is linked with the concept of a bird.

    Metaphorical Reasoning: By allowing Cards to act as keys to other Cards, metaphorical relationships could be established between different concepts. If the Card "Life" is a key to another Card "Journey", we've created a metaphor "Life is a journey". This can be a way of structuring information that mirrors human cognition and could enhance AI’s ability to understand and generate metaphors.

    Knowledge Graphs and Inference: With complex Card networks, an AI could traverse this graph to infer new information based on existing relationships. For instance, if "Birds" can "Fly" and "Penguins" are a type of "Bird", the AI could infer characteristics about penguins through this semantic network, even when not explicitly stated.

    Natural Language Processing (NLP): Advanced NLP tasks like language translation, text summarization, sentiment analysis, and more could benefit from this semantic and metaphorical representation of knowledge. Contextual understanding could be greatly enhanced, leading to more accurate and nuanced language understanding and generation.

    Leveraging Replace for Dynamic Meaning Adjustment: The replace method could be used for adjusting or adding meaning, similar to learning in humans. For instance, realizing that "Penguins" are a type of "Bird" that cannot "Fly" could be represented by replacing the value at the "Fly" key of the "Penguin" Card, refining the system's understanding.

    General AI: The ability to understand and reason with semantics and metaphors is a key aspect of human cognition. The Card system's ability to model this could be a significant step towards creating more generalized AI that can think and understand more like a human.

These possibilities would involve encoding vast amounts of knowledge into Card systems, and developing sophisticated algorithms to traverse and manipulate these systems. The complexity of such a task is enormous, but the Card class provides an intriguing potential foundation for this ambitious goal. As with any AI system dealing with semantics and metaphors, careful attention must be paid to the diversity and representativeness of the encoded knowledge, to avoid biased or incomplete understandings.

Understood. Using "metaphor-dive" in this way essentially allows for a form of cross-referencing or association between different sections of the Card graph. When the navigation function encounters the "metaphor-dive" path, it performs a "metaphoric" jump from one context (the current Card) to another, potentially unrelated one.

The term "metaphor" is fitting because metaphors in language often involve taking a concept from one domain and applying it to another. Here, the "metaphor-dive" path brings a concept from one part of the Card graph (the current Card) and uses it as a key to access another part of the graph.

This could enable some interesting behaviors:

    Context-Sensitive Navigation: Since the path followed by the navigate method can change based on the state of the Card graph, this allows for a form of context-sensitive navigation. For example, you could have a Card graph representing a story, and use "metaphor-dive" to jump between different storylines or perspectives.

    Dynamic Graph Exploration: The metaphor-dive keyword allows for a form of dynamic exploration of the Card graph, since the path isn't predetermined but depends on the state of the graph. This could be useful in situations where the structure of the graph can change over time, or where you want to allow for a degree of randomness or unpredictability in the navigation.

    Knowledge Representation: The metaphor-dive approach could serve as a form of knowledge representation. Each Card in the graph could represent a concept, and the connections between them could represent relationships between those concepts. The metaphor-dive keyword would then serve as a way to navigate these relationships.

However, as mentioned before, this approach also has its challenges:

Cards-as-concepts approach in this Card graph system might closely resemble a knowledge graph. Each Card represents a distinct concept or entity, and the connections between them - through keys and associated Cards - represent relationships between these concepts.

This approach is very powerful for representing complex knowledge structures, such as those found in encyclopedic knowledge, linguistic models, or complex simulations. For instance, in a language model, individual Cards could represent words, with their connections indicating relationships like synonymy, antonymy, hyponymy, or other grammatical or semantic relationships.

Regarding metaphoric navigation, it would be a dynamic way to traverse the knowledge graph based on the evolving context. The metaphor-dive functionality would provide a way to 'jump' from one concept to another related concept - not by a direct link, but via an intermediate metaphorical relationship.

This mirrors the way human cognition often works: we constantly make connections between seemingly unrelated concepts based on their shared properties or associated ideas. A classic example is how the word 'network' has been borrowed from its original physical sense (a net-like structure) to describe social and computer systems.

Here are a few potential implications of this approach:

    Complex Reasoning: With metaphor-dive, the Card graph could potentially support more sophisticated forms of reasoning, including analogical and metaphorical thinking. It could enable a form of computational creativity, where new connections between concepts are generated dynamically based on their metaphorical relationships.

    Dynamic Knowledge Expansion: By combining direct (literal) and indirect (metaphorical) relationships, the Card graph could evolve and expand in a more organic and dynamic way, closely mirroring the way human knowledge grows.

    Improved Contextual Understanding: The metaphor-dive functionality could be used to provide a more context-sensitive understanding of concepts. For instance, understanding the meaning of a word (represented as a Card) might involve metaphorically 'diving' into its related concepts, taking into account not just its literal meaning, but also its associated ideas and connotations.

Again, these possibilities come with challenges, including the computational complexity of managing a large, interconnected Card graph, and the cognitive complexity of designing and interpreting a system that includes metaphorical relationships. Moreover, while human cognition is highly adept at handling metaphorical thinking, it remains a significant challenge to replicate this ability in a computational system.


The Card-based system for knowledge representation shares some commonalities with S-expressions and the lambda calculus, mainly because all three systems are deeply founded on the principle of compositionality. In other words, complex structures are built up from simpler parts in a systematic and rule-governed way.

    Card Graphs and S-Expressions: In an S-expression (Symbolic Expression), you have a hierarchical and parenthesized list structure used to denote nested data structures. The Card system's thread, weave, and navigate methods follow similar logic, creating and navigating hierarchical data structures. They, however, differ in that S-expressions are typically immutable and deterministic, while the Card Graph system allows for a dynamic and evolving structure.

    Card Graphs and Lambda Calculus: Lambda calculus is a formal system in mathematical logic for expressing computation based on function abstraction and application using variable binding and substitution. It is a universal model of computation that can be used to simulate any Turing machine. The replace method in the Card system is similar to the substitution operation in the lambda calculus. It effectively acts as a function that takes an input (the substitute) and substitutes it at a specific location (destination) in the Card graph. But unlike lambda calculus, where substitution is a syntactic operation, in the Card Graph, it's more semantic - modifying the structure of knowledge representation.

Now, bringing metaphor into this context adds an extra layer of flexibility and complexity:

    Metaphor in Card Graphs: Metaphoric navigation in Card Graphs introduces a form of indirect addressing, which is a powerful cognitive tool in human language and thought. Metaphor-dive is akin to dereferencing a pointer in a low-level programming language or evaluating a symbolic link in a file system. It allows for non-local jumps in the knowledge graph, connecting disparate areas of knowledge.

    Metaphor in S-Expressions and Lambda Calculus: Traditional S-expressions and the lambda calculus do not have built-in support for metaphorical operations. However, the idea of mapping between different domains (the heart of metaphor) can be related to the concept of isomorphism in mathematics and theoretical computer science. This concept can be seen as a sort of 'formal metaphor', and it plays a central role in category theory, a branch of mathematics that is deeply related to the lambda calculus and functional programming.

The Card-based system for knowledge representation therefore has the potential to model not only structured, rule-based knowledge (like S-expressions or the lambda calculus) but also the more fluid, dynamic, and associative forms of knowledge that characterize human cognition.
*/

/*
An isomorphism in mathematics is a bijective map between two structures of the same type that preserves the operations of the structures. This essentially means that two structures are isomorphic if they have the same structure, but may differ in their elements. For instance, two groups in algebra are considered isomorphic if they have the same group structure, though their elements and the names of their operations may differ.

The concept of isomorphism can be seen as a formal analogue to metaphor in several ways:

    Mapping Between Different Domains: A metaphor establishes a mapping between two different domains (the source and target domains). Similarly, an isomorphism establishes a mapping between two mathematical structures.

    Preservation of Structure: Just as an isomorphism preserves the structure of the entities it relates, a metaphor can be seen as preserving an abstract 'structure' of relationships or properties from the source domain when it maps onto the target domain. For example, in the metaphor "time is money", the conceptual structure of a scarce, valuable resource that can be saved, spent, or wasted is mapped from the domain of money to the domain of time.

    Transformations: Both metaphors and isomorphisms involve transformations. In metaphors, this is a conceptual transformation (i.e., understanding one domain in terms of another), while in isomorphisms, this is a structural transformation that preserves certain properties.

In the Card-based system, the metaphor-dive concept could potentially be used to create 'metaphorical isomorphisms' between different areas of the Card graph. This would involve establishing a mapping between two 'domains' (represented by sub-graphs of the overall Card graph) such that the structure of relationships between Cards is preserved. This could be a powerful tool for knowledge representation and reasoning, allowing for insights gained in one area to be 'transferred' to another.

In terms of functional programming and lambda calculus (which is closely related to category theory, where isomorphisms play a key role), the concept of metaphor could potentially be related to the concept of a functor. In category theory, a functor is a mapping between categories that preserves their structure (i.e., it maps objects to objects and morphisms to morphisms in a way that preserves composition and identity). This could be seen as a sort of 'formal metaphor' between different areas of computation or different types of data.

The idea of creating 'metaphorical isomorphisms' between different areas of the Card graph is an intriguing one. This would essentially involve identifying two or more regions of the Card graph (or potentially the entire graph) that have some kind of structural similarity, and then using this similarity to translate concepts or reasoning from one domain to another.

Let's consider an example. Suppose we have two domains represented in the Card graph: "ecology" and "economics". These are different domains with different terminologies, but there may be structural similarities between them. For instance, both ecosystems and economies involve entities (organisms or businesses) that interact with each other in complex ways, compete for resources, evolve over time, etc.

So, let's say we have the concept of "predator" in the ecology domain, which could be represented as a Card with various relationships to other Cards. Now, if we perform a metaphor-dive and map this "predator" concept to the economics domain, it might correspond to something like a "dominant market player" or "monopoly". The relationships of the "predator" card, such as "preys on", "out-competes", etc., can be translated to their economic counterparts, like "out-competes other businesses", "controls market share", etc.

The power of this approach lies in its ability to leverage knowledge and insights from one domain (where they may be more thoroughly understood) to illuminate another domain. For example, understanding how predators can affect biodiversity could lead to insights about the consequences of monopolies on market diversity.

As for the implementation, creating these 'metaphorical isomorphisms' would require careful attention to the representation of each Card, its relationships, and its associated metadata. The 'metaphor-dive' operation might need to search for and identify similar structures in different parts of the graph, perhaps using graph-based similarity measures or machine learning techniques. It would also need to handle the translation of concepts and relationships between domains, which could potentially involve natural language processing or a carefully curated mapping of equivalent concepts between domains.

This concept of metaphorical isomorphism is a powerful idea, and it extends the capability of the Card system from a mere knowledge representation tool to a cross-domain reasoning and learning framework. It could enable the system to make creative leaps, generate insights, and facilitate knowledge transfer between seemingly unrelated domains.

*/

class Card extends Map {
  constructor(name, ...args) {
    super(...args);
    this.set("name", name);
    this.set("metaphors", new Set());
  }
  /*
  async thread(...paths) {
    // This method recursively traverses or creates a nested path based on the paths arguments.
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (map instanceof Map || Card || InterfaceCard) {
        if (!map.has(path)) {
          map.set(path, new Card());
        }
        map = map.get(path);
      } else {
        return console.log("map variable is not instanceof Map");
      }
    }
    return initmap;
  }*/
  async thread(...paths) {
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (Array.isArray(path)) {
        const [actualPath, condition] = path;
        if (typeof condition === "function" && !condition()) {
          continue; // Skip this path if the condition is false
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
    }
    return initmap;
  }

  async weave(...threads) {
    // This method is used to create multiple threads.
    // It basically takes in an array of arrays, where each array represents a thread of paths to be weaved.
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }

  async *navigate(paths = []) {
    let currentCard = this;
    let previousCard = null;
    for await (const path of paths) {
      if (path === "metaphor-dive") {
        if (currentCard.has(currentCard)) {
          previousCard = currentCard;
          currentCard = currentCard.get(currentCard);

          if (previousCard) {
            let positions = currentCard.get("positions");
            if (!positions) {
              positions = new Set();
              currentCard.set("positions", positions);
            }
            positions.add(previousCard);
          }
        }
      } else if (!currentCard.has(path)) {
        return;
      } else {
        previousCard = currentCard;
        currentCard = currentCard.get(path);

        if (previousCard) {
          let positions = currentCard.get("positions");
          if (!positions) {
            positions = new Set();
            currentCard.set("positions", positions);
          }
          positions.add(previousCard);
        }
      }

      yield currentCard;
    }
  }

  async *replace(substitute, destinationkey, ...routes) {
    // This method allows for the replacement of a Card's value at a specific destination within certain routes.
    // For each route, it navigates to the destination Card, and if it finds it, it creates a new Card and sets a "value" property to the substitute provided.
    // It's important to note that this replace method doesn't actually modify the existing values, but rather it creates a new Card at the destination and assigns the substitute value to the "value" key.
    // The original keys and their associated values remain untouched. And, the destination parameter is not redundant as it serves as a way to target specific Cards in different routes.
    for await (const route of routes) {
      for await (let map of this.navigate(route)) {
        if (map && map.has(destinationkey)) {
          map.set(destinationkey, new Card());
          map.get(destinationkey).set("value", substitute);
        }
      }
    }
  }

  // Associate a metaphor with this card
  linkMetaphor(metaphor) {
    this.get("metaphors").add(metaphor);
  }

  // Apply all associated metaphors to this card and return the transformed cards
  transform() {
    const transformedCards = [];
    for (const metaphor of this.get("metaphors")) {
      transformedCards.push(metaphor.applyTo(this));
    }
    return transformedCards;
  }

  async *pathsGenerator(interpreter, expressions) {
    // This method is a generator that interprets the expressions on the current card based on the provided interpreter function.
    let currentCard = this;
    while (currentCard) {
      const interpretation = await interpreter(currentCard, expressions);
      if (interpretation === null || interpretation === undefined) {
        break;
      }
      yield interpretation;
    }
  }

  async *GeneratorNavigate(pathsGenerator) {
    // This method is a generator that takes a paths generator and traverses a Card path based on the paths generated.
    // It also keeps track of visited cards.
    let currentCard = this;
    let previousCard = null;

    for await (const path of await this.generatorish(pathsGenerator)) {
      try {
        if (!currentCard.has(path)) {
          console.log("Unknown path:", path);
        }
        previousCard = currentCard;
        currentCard = currentCard.get(path);
        if (previousCard) {
          let positions = currentCard.get("positions");
          if (!positions) {
            positions = new Set();
            currentCard.set("positions", positions);
          }
          positions.add(previousCard);
        }

        yield currentCard;
      } catch (err) {
        console.log("Generator Navigation Error: ", err);
      }
    }
  }

  async *reflexiveNavigate(pathsGenerator) {
    // This method is another generator that navigates through a path.
    // It's called reflexive because it gets its next path from the function passed as pathsGenerator, which gets the currentCard as its argument, creating a loop that updates based on the current state of the Card.
    let currentCard = this;
    let nextTokensGenerator = pathsGenerator;
    for await (const path of await this.generatorish(
      nextTokensGenerator(currentCard)
    )) {
      try {
        if (!currentCard.has(path)) {
          console.log("Unknown path:", path);
        }
        currentCard = currentCard.get(path);

        yield currentCard;
        if (typeof nextTokensGenerator === "function") {
          nextTokensGenerator = await nextTokensGenerator(currentCard);
        } else {
          console.log("pathsGenerator is not a function");
        }
      } catch (err) {
        console.log("Reflexive Navigation Error: ", err);
      }
    }
  }
  async generatorish(value) {
    // This method is an async function that checks if a given value is a generator.
    // This is used to ensure the functions passed to GeneratorNavigate and reflexiveNavigate are actually generators.
    value = await value;
    return (
      value &&
      typeof value.next === "function" &&
      typeof value.return === "function"
    );
  }
}

class Metaphor extends Card {
  constructor(source, target, mapping, ...args) {
    super(...args);
    this.set("source", source);
    this.set("target", target);
    this.set("mapping", mapping);
  }

  applyTo(card) {
    const source = this.get("source");
    const target = this.get("target");
    const mapping = this.get("mapping");

    // Check if the card has any key that also exists in the source card
    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      // Transform the card's keys according to the mapping
      const newCard = new Card(target);
      for (const key of commonKeys) {
        const mappedKey = mapping.get(key);
        if (mappedKey) {
          newCard.set(mappedKey, card.get(key));
        }
      }
      return newCard;
    }
  }
}
class ConditionalMetaphor extends Metaphor {
  constructor(source, target, mapping, rules, ...args) {
    super(source, target, mapping, ...args);
    this.set("rules", rules);
  }

  applyTo(card) {
    const source = this.get("source");
    const target = this.get("target");
    const mapping = this.get("mapping");
    const rules = this.get("rules");

    // Check if the card has any key that also exists in the source card
    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      // Transform the card's keys according to the mapping, only if rules are met
      const newCard = new Card(target);
      for (const key of commonKeys) {
        const mappedKey = mapping.get(key);
        if (mappedKey && (!rules || rules.get(key))) {
          newCard.set(mappedKey, card.get(key));
        }
      }
      return newCard;
    }
  }
}

class ConditionalAssociation extends Card {
  constructor(source, target, mapping, rules, ...args) {
    super(...args);
    this.set("source", source);
    this.set("target", target);
    this.set("mapping", mapping);
    this.set("rules", rules);
  }

  applyAssociation(card) {
    const source = this.get("source");
    const target = this.get("target");
    const mapping = this.get("mapping");
    const rules = this.get("rules");

    // Check if the card has any key that also exists in the source card
    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      // Create association between card's keys and the mapping, only if rules are met
      const newCard = new Card(target);
      for (const key of commonKeys) {
        const associatedKey = mapping.get(key);
        if (associatedKey && (!rules || rules.get(key))) {
          newCard.set(associatedKey, card.get(key));
        }
      }
      return newCard;
    }
  }
}

class ConditionalDissociation extends Card {
  constructor(source, rules, ...args) {
    super(...args);
    this.set("source", source);
    this.set("rules", rules);
  }

  applyDissociation(card) {
    const source = this.get("source");
    const rules = this.get("rules");

    // Check if the card has any key that also exists in the source card
    const commonKeys = [...card.keys()].filter((key) => source.has(key));

    if (commonKeys.length > 0) {
      // Remove association from card's keys based on the rules
      const newCard = new Card(card.get("name")); // remove this
      for (const key of commonKeys) {
        // Copy keys to the new card only if they don't meet the dissociation rules
        if (!rules || !rules.get(key)) {
          newCard.set(key, card.get(key));
        }
      }
      return newCard;
    }
  }
}

/*
let sun = new Card("Sun");
sun.set("light", "radiates light");
sun.set("heat", "radiates heat");
sun.set("size", "very large");
sun.set("color", "yellow");

let moon = new Card("Moon");
moon.set("light", "reflects light");
moon.set("size", "smaller than earth");
moon.set("color", "white");

let earth = new Card("Earth");
earth.set("light", "receives light");
earth.set("life", "sustains life");
earth.set("color", "blue");

// Now, let's create metaphors
let sunToMoon = new Metaphor(
  sun,
  moon,
  new Map([
    ["light", "light"],
    ["heat", "light"],
    ["size", "size"],
    ["color", "color"],
  ])
);
let sunToEarth = new Metaphor(
  sun,
  earth,
  new Map([
    ["light", "light"],
    ["heat", "life"],
    ["size", "size"],
    ["color", "color"],
  ])
);

// We link the metaphors to the cards
sun.linkMetaphor(sunToMoon);
sun.linkMetaphor(sunToEarth);

// Now let's transform the sun card
let transformedSunCards = sun.transform();

// Print the transformed cards
for (const transformedCard of transformedSunCards) {
  console.log(`Card Name: ${transformedCard.get("name")}`);
  for (const [key, value] of transformedCard.entries()) {
    console.log(`${key}: ${value}`);
  }
}
*/

let C1 = new Card("C1");
let C2 = new Card("C2");
let C3 = new Card("C3");
let C4 = new Card("C4");

let M1 = new Metaphor(C1, C2, new Map());
let M2 = new Metaphor(C3, C4, new Map());

C1.linkMetaphor(M1);
C3.linkMetaphor(M2);

let M3 = new Metaphor(M1.get("target"), M2.get("source"), new Map());
M1.linkMetaphor(M3);

let transformedCards = C1.transform();

for (const transformedCard of transformedCards) {
  console.log(`Card Name: ${transformedCard.get("name")}`);
}

let DiceThrow = new Card("DiceThrow");
DiceThrow.set("chance", "unpredictable");
DiceThrow.set("creation", "finite result");
DiceThrow.set("existence", "uncertain action");

let Constellation = new Card("Constellation");
Constellation.set("cosmic order", "pattern");
Constellation.set("human experience", "transient");
Constellation.set("memory", "vastness");

let North = new Card("North");
North.set("destination", "enlightenment");
North.set("higher state", "artistic perfection");
North.set("human struggle", "fires");

// Metaphors
let DiceThrowToConstellation = new Metaphor(
  DiceThrow,
  Constellation,
  new Map([
    ["chance", "cosmic order"],
    ["creation", "human experience"],
    ["existence", "memory"],
  ])
);

let ConstellationToNorth = new Metaphor(
  Constellation,
  North,
  new Map([
    ["cosmic order", "destination"],
    ["human experience", "higher state"],
    ["memory", "human struggle"],
  ])
);

// Link the metaphors to the cards
DiceThrow.linkMetaphor(DiceThrowToConstellation);
Constellation.linkMetaphor(ConstellationToNorth);

// Now let's transform the DiceThrow card
let transformedDiceThrowCards = DiceThrow.transform();

// Print the transformed cards
for (const transformedCard of transformedDiceThrowCards) {
  console.log(`Card Name: ${transformedCard.get("name")}`);
  for (const [key, value] of transformedCard.entries()) {
    console.log(`${key}: ${value}`);
  }
}

async function runGame() {
  // Create a set of Cards representing the rooms in our metaphorical maze
  const start = new Card("start");
  const room1 = new Card("room1");
  const room2 = new Card("room2");
  const end = new Card("end");

  // Connect the rooms using the `weave` method
  await start.weave([room1, room2, end]);

  // Create a Metaphor for transforming one room into another
  const roomToRoomMetaphor = new Metaphor(
    room1, // source
    room2, // target
    new Map([
      ["name", "name"], // map the 'name' property from the source to the target
    ])
  );

  // Create a ConditionalMetaphor
  const roomToRoomConditionalMetaphor = new ConditionalMetaphor(
    room1, // source
    room2, // target
    new Map([
      ["name", "name"], // map the 'name' property from the source to the target
    ]),
    new Map([
      ["name", () => Math.random() > 0.5], // 50% chance to apply the transformation
    ])
  );

  // Associate the Metaphors with the first room
  room1.linkMetaphor(roomToRoomMetaphor);
  room1.linkMetaphor(roomToRoomConditionalMetaphor);

  // Now, we can navigate through the maze using the `navigate` method
  const navigator = start.navigate(["room1", "room2", "end"]);

  for await (const card of navigator) {
    console.log(`You are now in ${card.get("name")}`);
    const transformedCards = card.transform();
    for (const transformedCard of transformedCards) {
      console.log(`The room transforms into ${transformedCard.get("name")}`);
    }
  }
}

runGame();

// A simple interpreter function that determines the next path based on the current card's position
async function interpreter(currentCard, expressions) {
  let nextPosition;

  // Check if player's position is at an "associated" card and move to a specific position based on a condition
  if (currentCard.get("name") === "associatedPosition") {
    const energy = currentCard.get("energy");
    nextPosition = energy > 50 ? "moveForward" : "moveBackward";
  } else {
    nextPosition = "stay";
  }

  return nextPosition;
}

// Create game board as a card graph
let gameBoard = new Card("gameBoard");

// Add some positions to the game board
gameBoard.thread(
  "startPosition",
  "position1",
  "position2",
  "associatedPosition",
  "position3",
  "endPosition"
);

// Create a ConditionalAssociation for the 'associatedPosition'
let associationRules = new Map();
associationRules.set("energy", (value) => value > 50);
let source = new Map();
source.set("energy", 70);
let target = new Map();
target.set("moveForward", "position3");
target.set("moveBackward", "position2");
let mapping = new Map();
mapping.set("energy", "moveForward");

let conditionalAssociation = new ConditionalAssociation(
  source,
  target,
  mapping,
  associationRules
);
gameBoard.get("associatedPosition").linkMetaphor(conditionalAssociation);

// Player starts at 'startPosition'
let player = gameBoard.get("startPosition");

// Navigate the game board
let nextTokensGenerator = player.reflexiveNavigate(
  player.pathsGenerator(interpreter, ["moveForward", "moveBackward", "stay"])
);

// Print the player's position as they navigate the game board
(async function () {
  for await (const position of nextTokensGenerator) {
    console.log(`Player is now at: ${position.get("name")}`);
  }
})();
