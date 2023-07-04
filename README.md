# Play!

**Play!** is a new media, it is an interfacing interface and distributed semiosis.

**Music** has at its disposal duration of time.

**Painting** can present to the viewer the whole content of its message at one moment.

The **movie** attempted this synthesis of **music** and **painting** but lacked in *mutability* and *extensiveness*, *receptivity* and *interactivity*.

Indeed for what the **movie** itself lacked in *receptivity* and *mutability* it demanded of the viewer, and the injunction of this medium can be summarized as ***Watch!***

The **interface** partially inverted the **movie-viewer** relation adding *mutability, extensiveness, receptivity* and *interactivity* to the thing in view.

The **social-interface** brought *sociality* to the*mutability, extensiveness, receptivity,* and *interactivity* of the **interface** in ways defined by the affordances of the particular **interface**.

The **interfacing interface** brings *mutability*, *extensiveness*, *interactivity*, *receptivity* to the architecture/frame of **interface** itself through **interface** itself. The injunction of this interface is ***Play!***

---

**Play!** is an interface for navigating and transforming the Semioverse (a semiotic computing/programming environment). Players can connect, communicate, and engage in independent yet interoperable games. It functions as a symbol system where symbols are not just being used but continuously created and redefined.

Each game represents a semiotic domain, a self-contained yet interoperable universe of meaning. Here, Game and Play serve as base classes for creating, interacting with, and sharing semioverses.

The Play class, specifically, handles the networking aspect, joining and leaving networks, handling connections, and passing data between connected peers.

This can be seen as a distributed meaning-making system, where each peer can generate, share, and interpret symbols/expressions within their own context, while also receiving and interpreting symbols/expressions from others.

With this architecture, semiotic interaction is not only happening within each game but also at the network level. The system is designed to handle any expression received from another peer and pass it to all its games, a process similar to the spread of memes or ideas within a social network.

---

# Cards

The Card class creates a multi-dimensional, non-linear, interconnected network of nodes where every node (Card) itself can contain other nodes (Cards). This creates an intricate web of relationships that are defined by both the keys and values of each Card. The Card class extends the Map class thus preserving the insertion order of key-value pairs, where keys and values can be of any type.

The Card class includes methods such as thread, weave, navigate, and substitute, each functionally representing different components of meaning and facilitating the creation, navigation, and transformation of the Card network.

**thread**: The thread method works by creating a chain of nested Cards within the current Card based on the provided paths. Each path represents a sequence of keys or Card names to be followed or created if not existent.

**weave**: The weave method utilizes the thread method to weave several threads, much like weaving a tapestry.

**navigate**: The navigate method is a generator that iterates through paths and keeps track of the previous card and stores it in the positions set, effectively allowing for bidirectional navigation. It yields a new context each time it steps through the path.

**substitute**: The substitute method is a signifier for substitution or transformation. It's an act of exchange, replacing one signifier with another within the structure of the Card. It functions by navigating along defined routes and performing a substitution. The significance of this and its parallels to the lambda calculus will be explored in later sections.

What emerges from the methods introduced so far is a dynamic system of meaning where individual units (Cards) are linked through paths (thread), creating a complex network (weave) that can be explored (navigate) and transformed (substitute).

# Extensions

Extensions provided (condTransformExtension, condDissassociatorExtension, delegatorExtension, eventExtension, eventDelegatorExtension, runnerExtension) are factory functions to extend a Card instance with new properties and functionalities.

* condTransformExtension: Provides conditional transformation capability to a card.
* condDissassociatorExtension: Provides capability to conditionally dissociate certain keys from a card.
* delegatorExtension: Adds delegation capabilities to a card, enabling it to delegate a method call based on certain conditions.
* eventExtension: Adds event handling capabilities to a card, allowing it to respond to and emit events.
* eventDelegatorExtension: Adds event delegation capabilities to a card, enabling it to delegate a method call and respond to the completion of the delegation with an event.
* runnerExtension: This extension is intended to add execution capabilities to a Card, allowing the Card to maintain a state and execute defined delegators.

## Metaphor

In semiotics, a metaphor involves using a signifier from one sign system to represent something in another system. Metaphors can bridge gaps between disparate concepts, making unfamiliar ideas more relatable and understandable. Using Card instances as keys essentially enables the system to function on multiple levels of abstraction simultaneously.

Because the Card class extends the Map class allowing for keys and values to be of any type, keys can themselves be Card instances. By permitting keys to be Card instances rather than simple identifiers (of type string/symbol), the system allows for metaphorical connections to be made.

Using Card instances as keys, signifying metaphor, adds a degree of conceptual abstraction that makes this system incredibly powerful for bridging gaps between disparate systems or concepts.

This design can accommodate an enormous range of applications and use-cases. For example, it could be used to model and navigate complex conceptual systems, such as a web of scientific knowledge, dynamical social networks, or evolving ecosystems. It could also be used to create intricate game worlds, or to build a language parsing system that understands context and metaphor.

## Metaphor-dive during Navigation

When the navigation method encounters the "metaphor-dive" token, it performs 'jump' from one concept to another related concept - not by a direct link, but via an intermediate implicitly metaphorical relationship

When the navigation method encounters the "metaphor-dive" token, it traverses into the card that is being used as a key in the current card. Rather than traversing the “metonymic axis” of language the “metaphor-dive” allows for traversals across the “metaphoric axis” of language. A metonymic thread can then consist entirely of metaphors.

This mirrors the way human cognition often works: we constantly make connections between seemingly unrelated concepts based on their shared properties or associated ideas. A classic example is how the word 'network' has been borrowed from its original physical sense (a net-like structure) to describe social and computer systems.

With metaphor-dive, the Card graph could potentially support more sophisticated forms of reasoning, including analogical and metaphorical thinking. It could enable a form of computational creativity, where new connections between concepts are generated dynamically based on their metaphorical relationships. By combining direct (literal) and indirect (metaphorical) relationships, the Card graph could evolve and expand in a more organic and dynamic way, closely mirroring the way human knowledge grows.

# Cyclic Tautologies

Reason as Testing Laws, cyclic tautologies in the card-graph upon interpretation through rules of inference.

# Install

In the future distributed networking will occur in the browser with no need for installation. Currently however, using hyperswarm requires us to run locally using node.

For now, download the repo:

In one command line window:

```bash
npm install
cd main
node index.js
```

In another command line window:

```bash
http-server
```

Open the browser and go to http://127.0.0.1:8080

# Onwards!

    Graph-based Computation and Data Flow Programming: The Card class can be seen as a basic building block for a graph-based computation system. Complex operations can be broken down into simpler operations and represented as a graph of Card instances. The navigate function can be used to traverse this graph, essentially executing the operation. The substitute function can perform substitutions in the graph, acting like computation in the data flow. This is akin to data flow programming where the focus is on the movement and transformation of data within the system.

    Visual Programming Environments: With its ability to model complex operation-operand structures as graphs, the Card class could be used as the basis for a visual programming environment. Each Card could be represented visually as a node, with threads between nodes representing the relationships between them. This could make programming more accessible and intuitive, especially for people who are new to coding.

    Metaphorical and Semantic Computing: The ability of the Card class to use other Card instances as keys opens up possibilities for metaphorical and semantic computing. This could allow for the creation of systems that can understand and reason with metaphors, opening up new possibilities in fields like natural language processing and intelligence.

    Interactive Storytelling and Game Design: The Card class could be used to create interactive narratives or game worlds. Each Card could represent a scene, character, or object, with the relationships between cards defining the structure of the narrative or game world. This could allow for highly interactive and non-linear storytelling experiences.

    Modular and Expandable Software Design: With its thread, weave, navigate, and substitute methods, the Card class provides a strong foundation for modular and expandable software design. New functionalities can be added by simply adding new Card instances and threading them appropriately.

    Systems Simulation: The multi-dimensional nature of the Card system provides a powerful structure for system simulations. It could be utilized to represent a range of systems from simple hierarchical structures to more complex nested systems. For example, in an ecological model, each Card could represent different ecological components—organisms, populations, communities, and so on—with their interconnectedness represented as threads between the cards.

    Modeling and Simulating Neural Networks: With the Card structure, you could potentially model a neural network, where each Card could represent a neuron, and the links between them could represent the synapses. The substitute function could be used to adjust the weights of these synapses at run time.

# Rel! (Generative Relational Runtime)

The code in this repository is by no means the only implimentation of these concepts, we are currently exploring these concepts through a relational-programming paradigm:

https://docs.google.com/document/d/1iy59rRTpHwqwyyHj7ZSTxyf4df6_yI8MwjgS1tA7zj8/edit

# Rel! (Generative Relational Runtime)
