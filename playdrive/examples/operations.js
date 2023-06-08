import Card from "../card.js";

/*
The Card class, as defined here, is a structure that can be used to represent an operation-operand graph. In this context, operations can be considered as the keys in the Card and the operands as the corresponding values.

Let's demonstrate this by constructing an operation-operand graph for a mathematical operation using the Card class. Suppose we are trying to construct the mathematical operation 3 * (4 + 5) as a graph.
*/

// Initialize the root of the operation-operand graph.
let root = new Card();

// Define the cards for numbers 3, 4 and 5.
let three = new Card();
three.set("value", 3);

let four = new Card();
four.set("value", 4);

let five = new Card();
five.set("value", 5);

// Define the cards for the "+" and "*" operations.
let add = new Card();
let multiply = new Card();

// Weave the operation-operand graph.
await root.thread(multiply);
await multiply.thread(three, add);
await add.thread(four, five);

console.log(root);

/*
In the above code:

    three, four, and five ar\e Card instances that represent the numbers 3, 4, and 5, respectively.
    add and multiply are Card instances that represent the "+" and "*" operations, respectively.
    We create the operation-operand graph by threading the operations and operands together, starting from the root. The root Card threads into multiply, which then threads into three and add, and so forth.

This gives us a graph where each node is an operation (Card used as a key) and its operands (Card instances as values), allowing us to construct the 3 * (4 + 5) operation.

The navigate function could be used to traverse this operation-operand graph, and the replace function could be used to perform computation operations on this graph, substituting operation nodes with their results.

This way, using the Card class and its functions, we can model complex operation-operand structures as graphs, allowing for versatile and dynamic computational models. This opens up possibilities for things like graph-based computation, visual programming environments, and much more.

The Card class and its associated methods can lead to some exciting possibilities. Its design allows it to be flexible and versatile, making it a powerful tool in a variety of computational and semiotic contexts. Here are some speculative possibilities:

    Graph-based Computation and Data Flow Programming: The Card class can be seen as a basic building block for a graph-based computation system. Complex operations can be broken down into simpler operations and represented as a graph of Card instances. The navigate function can be used to traverse this graph, essentially executing the operation. The replace function can perform substitutions in the graph, acting like computation in the data flow. This is akin to data flow programming where the focus is on the movement and transformation of data within the system.

    Visual Programming Environments: With its ability to model complex operation-operand structures as graphs, the Card class could be used as the basis for a visual programming environment. Each Card could be represented visually as a node, with threads between nodes representing the relationships between them. This could make programming more accessible and intuitive, especially for people who are new to coding.

    Semantic Web and Knowledge Graphs: The Card class's structure is ideally suited for creating knowledge graphs. Each Card could represent a concept, with the relationships between Card instances representing semantic relationships between concepts. This could be a powerful tool for creating a semantic web, allowing complex interrelated data to be represented and navigated easily.

    Metaphorical and Semantic Computing: The ability of the Card class to use other Card instances as keys opens up possibilities for metaphorical and semantic computing. This could allow for the creation of systems that can understand and reason with metaphors, opening up new possibilities in fields like natural language processing and artificial intelligence.

    Interactive Storytelling and Game Design: The Card class could be used to create interactive narratives or game worlds. Each Card could represent a scene, character, or object, with the relationships between cards defining the structure of the narrative or game world. This could allow for highly interactive and non-linear storytelling experiences.

    Modular and Expandable Software Design: With its thread, weave, navigate, and replace methods, the Card class provides a strong foundation for modular and expandable software design. New functionalities can be added by simply adding new Card instances and threading them appropriately. This could make software maintenance and expansion more manageable and efficient.

In conclusion, the Card class, due to its unique properties and flexible structure, opens up a multitude of possibilities in various fields ranging from computation to semiotics. It's a rich area of exploration that could lead to significant advancements in how we approach computing and knowledge representation.

Continuing with the possibilities of the Card class:

    Hierarchical Modeling and Systems Simulation: The multi-dimensional nature of the Card system provides a powerful structure for hierarchical modeling and system simulations. It could be utilized to represent a range of systems from simple hierarchical structures to more complex nested systems. For example, in an ecological model, each Card could represent different ecological components—organisms, populations, communities, and so on—with their interconnectedness represented as threads between the cards.

    Advanced Querying and Database Systems: The navigate function allows traversing through the Card network in various ways. This can enable advanced querying capabilities. For instance, in a database system designed with Card instances, you could start at any given Card and traverse through its links (i.e., threads) to access related data. The navigation could be based on certain conditions, allowing for complex querying of data.

    Distributed and Parallel Computing: With the use of asynchronous functions and the inherent capability of Card instances to hold other cards, the Card system could be employed in distributed computing scenarios. Each Card could reside in a different location (even on different machines), and computations can happen independently and in parallel.

    Modeling and Simulating Neural Networks: With the Card structure, you could potentially model a neural network, where each Card could represent a neuron, and the links between them could represent the synapses. The replace function could be used to adjust the weights of these synapses during the training phase.

    Conceptual Blending and Creative AI: The use of the Card class could enable fascinating possibilities in the area of creative artificial intelligence. For instance, conceptual blending, a cognitive theory where new ideas result from integrating or blending different conceptual spaces, could potentially be modeled using the Card structure. This can open new avenues in creating AI systems capable of innovation or creativity.

These are all highly speculative possibilities and would need extensive work and research to be realized. However, the versatility and adaptability of the Card class make it a potentially powerful tool in these areas.
*/

function* idMaker() {
  while (true) {
    index = yield;
    yield index++;
  }
}

let x = idMaker.next(0); // no result
x = x++;
idMaker.next(x); // 2
