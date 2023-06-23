// make these all these cards instead of maps
// add all these as properties of card

/*
In terms of semiotics, this code can be seen as a system of signs, where each function name, method, and the objects they manipulate represent different components of meaning.

    Card: The Card class itself is a signifier, pointing to the concept of a card. Cards are typically symbolic of individual units of meaning within a larger system, like a deck of cards or a library catalog.

    thread: The thread method might be seen as the signifier for the concept of a path or a trajectory through the map of the card. This is quite symbolic, representing the journey of navigating through complex systems, pulling on a thread to unravel meaning, or connecting different points in a network. This function manipulates the Card to create a thread-like path, linking the different nodes in the constellation.

    weave: The weave method signifies the act of creating a complex system from individual threads, much like weaving a tapestry. This refers to the creation of intricate structures or narratives from individual, seemingly unconnected elements. The symbolic act here is one of integration and synthesis, of bringing together disparate parts to form a cohesive whole.

    navigate: The navigate method signifies movement through a system or network. It carries connotations of exploration, of discovery, and of plotting a course. It yields a new context each time it steps through the path, reinforcing the idea of a journey or voyage.

    replace: The replace method is a signifier for substitution or transformation. It's an act of exchange, replacing one signifier with another within the structure of the Card.

    Map: The use of Map and its extension to a Card creates another layer of meaning. Maps are traditionally used for navigation and for representing spatial relationships, here used to represent abstract relationships between objects in the card. The use of Map signifies interconnectedness, relationships, and networks.

The overall signified, or the concept that arises from all these signifiers, seems to be a dynamic system of meaning where individual units (Cards) are linked through paths (thread), creating a complex network (weave) that can be explored (navigate) and transformed (replace).

The code, therefore, can be seen as a semiotic system itself, as it uses signifiers (code and syntax) to point to signified concepts (the operations and structures the code creates). It's a language in itself, communicating ideas not just to the machine, but also to the humans reading and writing it.

ChatGPT

The Card class, as defined here, creates a multi-dimensional, non-linear, interconnected network of nodes where every node (Card) itself can contain other nodes. This leads to an intricate web of relationships that are defined by both the keys and values of each Card.

Considering that the keys themselves can be Card instances, this adds a depth of complexity to the overall structure and function of the system. By permitting keys to be complex Card instances rather than simple identifiers, the system allows for metaphorical connections to be made.

In the context of semiotics, a metaphor involves using a signifier from one sign system to represent something in another system. Metaphors can bridge gaps between disparate concepts, making unfamiliar ideas more relatable and understandable. Using Card instances as keys essentially enables the system to function on multiple levels of abstraction simultaneously.

This design can accommodate an enormous range of applications and use-cases. For example, it could be used to model and navigate complex conceptual systems, such as a web of scientific knowledge or a network of social relations. It could also be used to create intricate game worlds, or to build a language parsing system that understands context and metaphor.

Also, because every Card is itself a Map (an ordered list of key-value pairs), it opens up possibilities for creating nuanced relationships and hierarchies within each Card. Cards can be woven together to create intricate structures, each Card a microcosm that reflects the complexity of the whole.

The replace method adds another layer of dynamism to the system. It allows for the transformation and evolution of the network by substituting one node with another along the defined routes. This could signify learning or growth in an AI system, evolution in a genetic algorithm, or simply the passage of time in a dynamic system.

The use of async functions and generators adds to this dynamism. Asynchronous operations allow the system to manage multiple threads of execution simultaneously, mirroring the complexity and unpredictability of real-world systems. The generator function used in navigate method allows for lazy evaluation, meaning that complex navigational paths can be computed on-the-fly, one step at a time, reducing the computational overhead and allowing for potentially infinite paths.

In conclusion, the Card class defined in this code represents an intricate, dynamic, and deeply interconnected system that could serve as a foundation for modeling a wide array of complex systems, from networks of human knowledge to evolving ecosystems. The possibility of using Card instances as keys, signifying metaphor, adds a degree of conceptual abstraction that could make this system incredibly powerful for bridging gaps between disparate systems or concepts.

The lambda calculus is a universal model of computation that uses function abstraction and application as primary operations. It treats functions as first-class citizens where they can be passed as arguments, returned as values from other functions, or assigned to variables. The basic operations of the lambda calculus involve defining an anonymous function and applying that function to arguments.

The concept of substitution in lambda calculus is fundamental to function application. When a function is applied to an argument, the formal parameter of the function is substituted by the actual argument in the function's body.

In S-expressions, which are a notation for nested list (tree-structured) data, invented for and popularized by the programming language Lisp, code and data are written in the same way - as expressions. Lisp and other languages following its paradigm treat code as data, allowing for powerful meta-programming constructs.

Let's relate the Card class functions with these concepts:

    Lambda calculus - function abstraction and application:

        The Card class itself can be thought of as an abstract function, with keys and values as its parameters. thread, weave, navigate and replace can be seen as applying these abstract functions.

        The replace function can be directly tied to the concept of substitution in the lambda calculus. It goes through the routes provided, navigates to the destination, and substitutes the existing Card at the destination with a new one with the specified value. It applies this 'substitution function' to each route.

    S-expressions:
        The Card class in a sense embodies the essence of S-expressions. Each Card is an instance of Map, which can be seen as a list with key-value pairs. This list can be nested to form a tree-like structure, akin to S-expressions. The Card's keys and values being both data and potential function applications make them analogous to S-expressions in Lisp and similar languages.

    Operation and Operand Graph:
        Each Card can be seen as an operation that is applied to its values (operands). The values themselves can be Cards (operations), forming a potentially infinite operation-operand graph. This graph is navigated and manipulated with thread, weave, navigate and replace, resembling the computation process in lambda calculus and execution in Lisp-like languages.

In conclusion, the Card class shares several similarities with the principles of lambda calculus and Lisp-like languages using S-expressions. It provides a structure for nesting operations and operands in a graph-like structure, and it has a method for substitution that aligns with the core operation in lambda calculus. While not a direct implementation of these concepts, the Card class is a distinct, creative way of bringing some of their principles into JavaScript's object-oriented paradigm.
*/

class Card extends Map {
  constructor() {
    super();
  }

  async thread(...paths) {
    map = await this;
    let initmap = await map;
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

  // when a card uses this -> it uses itself as constellation.
  async weave(...threads) {
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }

  // when a card uses this -> it uses itself as root.
  async *navigate(...paths) {
    let map = this;
    for await (const path of paths) {
      if (map.has(path)) {
        map = map.get(path).map;
        yield map;
      }
    }
  }

  async replace(substitute, destination, ...routes) {
    for await (const route of routes) {
      for await (let map of this.navigate(route)) {
        if (map && map.has(destination)) {
          map.set(destination, new Card());
          map.get(destination).map.set("value", substitute);
        }
      }
    }
  }
}

class VisualCard extends Card {
  constructor() {
    super();
  }
}

// when a card has this, it uses itself as map
async function thread(map, ...paths) {
  map = await map;
  let initmap = await map;
  for await (const path of paths) {
    if (map instanceof Map || map instanceof Card) {
      if (!map.has(path)) {
        map.set(path, new Map());
      }
      map = map.get(path);
    } else {
      return console.log("map variable is not instanceof Map");
    }
  }
  return initmap;
}

// when a card has this -> it uses itself as constellation.
async function weave(...threads) {
  // these threads include
  let constellation = new Map();
  for (const thrd of threads) {
    await thread(constellation, thrd);
  }
  return constellation;
}

// when a card has this -> it uses itself as root.
async function* navigate(root, ...paths) {
  let map = root;
  for await (const path of paths) {
    if (map instanceof Map || map instanceof Card) {
      if (map.has(path)) {
        map = map.get(path);
        // becomes new map
      }
    }
  }
}

async function replace(substitute, destination, ...routes) {
  // we want to be able to substitute either the key or the value of the Map

  // navigate across the graph along different paths and then substitute at the end of those paths.
  for await (const route of routes) {
    let map = await navigate(root, route);
    map.set(destination, substitute);
  }
}

async function express(...threads) {
  // Input Schema: [_Source/Target/Expressions_] : [_Plaything_] : [Scenes] : [_Scene_] : [Roles] : [_Role_]: [Moves] : [_Move_]
  // a thread is an iterable of values, or object-references.
  let expr = new Map();
  expr.set("sources", new Map());
  expr.set("targets", new Map());
  expr.set("expressions", new Map());

  for (const thrd of threads) {
    await thread(expr, ...thrd); // assuming each thread is an array, spread it as arguments
  }

  for (const key of expr.keys()) {
    if (expr.get(key) instanceof Map) {
      // we make the assumption that the second nested key after sources, targets, and expressions
      // is always scenes
      for (const scene of expr.get(key)) {
        let sceneMap = scene[1].get("scenes");
        if (!sceneMap.has("expressions")) {
          sceneMap.set("expressions", new Map());
          sceneMap.get("expressions").set(expr, new Map());
        } else {
          sceneMap.get("expressions").set(expr, new Map());
        }
      }
    }
  }
  console.log(expr);
  return expr;
}

await express(
  [
    "sources",
    "Orpheus",
    "scenes",
    "Underworld",
    "roles",
    "Bard",
    "moves",
    "Sing",
  ],
  [
    "targets",
    "SoulOfPlay",
    "scenes",
    "Underworld",
    "roles",
    "LostSoul",
    "moves",
    "Listen",
  ],
  [
    "sources",
    "Athena",
    "scenes",
    "Olympus",
    "roles",
    "GoddessOfWisdom",
    "moves",
    "Weave",
  ],
  [
    "targets",
    "NewMythology",
    "scenes",
    "Olympus",
    "roles",
    "Potential",
    "moves",
    "Manifest",
  ],
  [
    "sources",
    "Hermes",
    "scenes",
    "Crossroads",
    "roles",
    "Messenger",
    "moves",
    "Connect",
  ],
  [
    "targets",
    "Players",
    "scenes",
    "Earth",
    "roles",
    "Seekers",
    "moves",
    "Understand",
  ],
  [
    "sources",
    "Players",
    "scenes",
    "Earth",
    "roles",
    "Seekers",
    "moves",
    "Play",
  ],
  [
    "targets",
    "NewMythology",
    "scenes",
    "Olympus",
    "roles",
    "Reality",
    "moves",
    "Shape",
  ]
);
