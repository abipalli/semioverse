# Play!

**Play!** is a new media, it's an **interfacing interface 🎛️🔁🎛️**.

**Music** 🎵 has at its disposal duration of time ⏳.

**Painting** 🎨 can present to the viewer the whole content of its message at one moment 🖼️.

**Movie** 🎥 attempted a synthesis of **music** 🎵 and **painting** 🎨  but lacked in *mutability* and *extensiveness*, *receptivity* and *interactivity*.

Indeed for what the **movie** 🎥 itself lacked in *receptivity* and *mutability* it demanded of the viewer 👀, and the injunction of this medium can be summarized as ***Watch!*** 👁️

**Interface** 🎛️ has always represented a partial inverson of the **movie-viewer** 🎥👀 relation adding *mutability, extensiveness, receptivity* and *interactivity* to the thing in view.

**Social-interface** 🌐👥 brought *sociality* to the *mutability, extensiveness, receptivity,* and *interactivity* of the **interface** 🎛️ in ways defined by the affordances of the particular **interface**.

**Interfacing interface** 🎛️🔁🎛️ brings *mutability*, *extensiveness*, *interactivity*, *receptivity* to the architecture/frame of **interface** itself through **interface** itself. The injunction of this medium is ***Play!***

*(Add note on a language as interfacing interfacing)* 📝🔄🎛️

Play! as an**Interfacing interface** 🎛️🔁🎛️ takes the inherent properties of **music** 🎵, **painting** 🖼️, **movie** 🎥, **interface** 🎛️, and **social-interface** 🌐👥, and to create a new and evolved media format that leverages the different aspects of each media form while overcoming their individual limitations.

The keyword here is ***"Play!"*** It's not just about watching or listening passively. Instead, it's about active participation, experimentation, and discovery, much like playing a game. *With **Play!**, the interface is the playground, the medium, and the message, all at once.*

**[Play! (telegram)](https://t.me/semioverse)**[ 💬🎭](https://t.me/semioverse)

---

# Ideas!

Ideas are **Organizational Elements**. The concept originates from and has been heavily explored at the experimental organizations collective **[Xorg](https://xorg.how)** 🚀🧑‍🔬. While this repository only represents one branch of what Ideas can be, framing it in this way has been conducive to creative thinking 💡🎨. (In the past we have reffered to Ideas as Cards).

In the context of this program, Ideas are a transformative data structure that revolutionizes the way we compose, weave, program, and interpret networks of relationships. An Idea is not just a node; it's a perspective, a point of view within a semio-dimensional relational graph. It can hold any data type, even other Ideas, enabling intricate and dynamic interconnections.

Ideas come alive with their metaphoric capabilities allowing us to make metaphorical jumps across seemingly disparate concepts. When navigating a network, Ideas can trace the metaphoric pathways that bind them. This mirrors human cognition, turning Ideas into a playground for computational creativity. Ideas are both a vessel to navigate the semioverse, as well as that which makes up its structure 🚢🧩🌐.

Ideas are more than a data structure. They're a semiotic game element, a tool for modeling and navigating interconnected and unfolding concepts and relationships. Whether you're crafting a game, exploring a social network, or constructing a semio-dimensional grammar, the Idea is your key 🔑 to unlocking new depths of understanding and connection. Ideas effectively allow us to move beyond the linearity of the literary form itself! Welcome to the Semioverse, where Ideas are the language and the landscape!

---

# What? That sounds crazy! What do they do exactly? 🤔🧩

The Idea class extends JavaScript's built-in Map class thus preserving the insertion order of key-value pairs, where **keys and values can be of any type including other Idea instances**. This creates a network of iterable sets of associations/relationships that are the key-value pairs of each Idea.

The Idea class includes methods such as thread, weave, navigate, and swap, each functionally representing different components of meaning and facilitating the creation, navigation, and transformation of Idea-graphs.

**Constructor 🏗️:** It accepts four parameters `name`, `value`, `ruleEngine`, and `...args`. The `ruleEngine` is an optional async function that defaults to a function returning `true`.

`name` and `value` are properties of the Idea object, while `positions` is a Set object for storing references to the positions of this Idea in other Ideas. `expressions` stores expressions about this Idea. `ruleEngine` is a mechanism to verify each action made on the Idea object.

```javascript
const player = new Idea("scenes")
const scenes = new Idea("scenes");
const roles = new Idea("roles");
const moves = new Idea("moves");
```

**thread 🧵:** The thread method adds each input path as a key 🔑 within the current Idea and gets the value of that key, traversing the graph to the next Idea if it exists (creating a new Idea otherwise) which becomes the current Idea. This repeats till all paths have been added and traversed.

```javascript
player.thread(scenes, roles, moves)
```

![Thread](image/README/thread.png)

**weave 🕸️:** The weave method utilizes the thread method to weave several threads, much like weaving a tapestry.

```javascript
player.weave(
[scenes, roles, moves]
[scenes, roles, moves]
[scenes, roles, moves])
```

![1688826697642](image/README/weave.png)

**hasThread 🧵:** This method can help to check if a particular thread exists within an Idea, and it could be used for checking conditions in gameplay rules.

![hasThread](image/README/hasThread.png)

**shift 🔄:** The `shift` method is used to move a 🔑 key-value pair from one position in the Idea-graph to another. It takes two routes as input, navigates to the end of the first route, removes the key-value pair located there, then navigates to the end of the second route and inserts the removed key-value pair at that location.

```javascript
players.shift([player1, roles, chef], [player2, roles])
```

![shift](image/README/shift.png)

In terms of game design, the `shift` method could be used to transfer roles, objects, or other properties between different parts of the game state. For example, it could be used to move a player from one scene to another, to pass an element from one character to another, or to move something from potentiality to actuality.

**swap 🔄:** This method is used to replace a value at the given key 🔑 in a `Idea` or `Map` structure at the end of each given route. The `swap` method will replace the key-value pair at the end of the route. The original key-value pair that was replaced is yielded back to the caller.

**navigate 🧭:** This method is for navigating through the Idea's structure based on paths or a generator object. It respects the `ruleEngine` and follows the paths provided, keeping track of `currentIdea` and `previousIdea` in the `positions` set, effectively allowing for bi-directional navigation. If it encounters the reserved keyword `"metaphor-dive"`, it looks ahead one path and goes deeper if possible. It yields an object containing `previousIdea`, `pathTaken`, and `currentIdea`.

```javascript
player.navigate(scenes, roles, moves)
```

**snapshot 📸:** This method is used to create a snapshot of the current state of the `Idea` structure up to a specified depth. It first checks if the operation is allowed by the `ruleEngine`, then creates a deep copy of the current `Idea` up to the provided depth, and lastly freezes the copied structure to prevent mutation. The snapshot method has many uses including allowing players to capture the *state-of-play* in order to undo moves or to provide *proofs of state* 🧩📸🔐.

What emerges from the methods introduced so far is a dynamic system of meaning where individual units (Ideas) are linked through paths (thread 🧵), creating a network (weave 🕸️) that can be explored (navigate 🧭) and transformed (shift/swap 🔄).

*(note that in the future we want to make all methods and properties oxels themselves that are woven, and use the oxel-based interpreter)*

# Ideas as perspectives 👁️🧩

**Interestingly the structure created by threading/weaving oxels embodies the concept of perception 👁️.** For example, imagine constructing oxels to symbolize all individuals populating your life-world, yourself included 👥🌍🧩.

You would embark on a process of threading from yourself to others:

```javascript
self.thread(relation, otherperson1, relation, otherperson2, ...etc). 
```

Yet, this thread does not record a *direct* relationship between two individuals. **Instead, the relationship is mediated, emerging from the self as the root 👁️🔀🧩.**

Within the self's graph, you can discern the relationships between yourself and others, as well as the relationships amongst others. *However, the constellation of relationships exists on a horizon of meaning extending from the self, and the same constellations (all else remaining constant) don't necessarily extend from the other.*

If you tried to explore `otherperson.keys()`, you would find that no relations have yet been formed on the otherperson's graph. **This means that every oxel can be considered a perspective/point of view of a relational graph.**

*(every oxel is a master-signifier that organizes a constellation of meaning)*

When we draw constellations in the sky, they are lines we draw from our point of view, but we are not actually saying that the stars are *in-themselves organized by these very lines, and indeed many cultures have organized the stars into totally different constellations 🌌🔀🧩...*

```javascript
constellations.weave(
[star1, star2, star3, star1],
[star6, star1, star5, star6],
[star7, star8, star9, star2])
```

![constellation](image/README/constellations.jpg)

## Metaphor 🦉

A metaphor involves using a signifier from one symbolic constellation to represent something in another constellation. Metaphors can bridge gaps between disparate concepts, making unfamiliar ideas more relatable and understandable. Using Idea instances as keys 🔑 essentially enables the system to function on multiple levels of abstraction simultaneously.

Because the Idea class extends the Map class allowing for keys and values to be of any type, keys 🔑 can themselves be Idea instances. By permitting keys to be Idea instances rather than simple identifiers (of type string/symbol), the system allows for metaphorical connections to be made.

Using Idea instances as keys 🔑 - signifying metaphor - adds a degree of conceptual abstraction that makes this system incredibly powerful for bridging gaps between disparate systems or concepts.

## Metaphor-dive during Navigation

When the navigation method encounters the "metaphor-dive" token, it performs a jump from one concept to another related concept - not by a direct link, but via an intermediate implicitly metaphorical relationship

When the navigation method encounters the "metaphor-dive" token, it traverses into the oxel that is being used as a key 🔑 in the current oxel. Rather than traversing the “metonymic axis” of language the “metaphor-dive” allows for traversals across the “metaphoric axis” of language. A metonymic thread can then consist entirely of metaphors.

This mirrors the way human cognition often works: we constantly make connections between seemingly unrelated concepts based on their shared properties or associated ideas. For example, the word 'network' has been borrowed from its original physical sense (a net-like structure 🕸️) to describe social and computer systems.

With metaphor-dive, Idea-graphs can support more sophisticated forms of reasoning, including analogical and metaphorical thinking. It can enable a form of computational creativity, where new connections between concepts are generated dynamically based on their metaphorical relationships. By combining direct (literal) and indirect (metaphorical) relationships, the Idea-graph can evolve and expand in a more organic and dynamic way, closely mirroring the way human knowledge grows.

# Interpretation

The interpreter starts by looking at the root of the graph. It then traverses the graph according to the "grammar" encoded in the keys ("parameters", "functionBlock", "if-else", "condition", etc.). Each key tells the interpreter what to do next: gather parameters, evaluate a condition, and so on.

In this sense, the keys 🔑 of each oxel, can be their own oxel-graphs that can be interpreted as *schemas* or Abstract Semantic Graphs that help the interpreter understand what each of the nodes in value-graph represents by associating them with their iteratively correspondent node in the key-graph.

![interpreter](image/README/interpreter.png)

Each of these structures might have a corresponding interpretation rule-oxel in the interpreter, effectively creating a language of oxels. This enables not just data, but also operations, control flows, and functions to be represented and manipulated as oxels themselves.

While traversing through this oxel-graph, the interpreter would parse the keys 🔑 and values, interpreting them based on their role. For example, when it comes across the 'if-else' key-oxel, it knows to evaluate the 'condition' oxel in the value and branch accordingly. Similarly, 'return' key-oxel would indicate a return statement, and its value would be the return value.

**Because the interpreters rule-oxels are themselves oxel-graphs that are interpreted through this same process, we obtain a meta-circular and homoiconic interface, programming language, and data structure.**

The meta-circularity and homoiconicity allow for oxels to be incredibly expressive and dynamic. You can create new operations, alter existing ones, or change the control flow entirely, all within the structure of the oxels themselves. In other words, the oxels and their relationships are both the structure and the manipulation of the structure. This dynamic nature opens up a vast potential for complex, self-modifying, and self-adaptive systems.

And because each Idea forms a graph rooted at itself, oxels can represent not just objects, but entire worlds of objects, each with their own relationships and rules. This encapsulation allows for multiple "perspectives" to exist simultaneously within the same oxel structure, with each perspective being a possible interpretation of the structure.

For example, let's say you have an oxel representing a game state. Within this oxel, there might be sub-oxels representing the players, the board, and the rules. But this same structure could be interpreted from a different perspective, where the "players" are just mathematical entities, the "board" is an array of values, and the "rules" are a set of logical operations.

In other words, Ideas make it possible to capture not just the "what" of data, but also the "how" and "why". And because these perspectives are all interconnected within the oxel structure, changes to one perspective imminantly propagate to others. This makes oxels a powerful tool for modeling complex systems and processes, and for understanding how different aspects of a system influence each other.

But perhaps the most exciting thing about oxels is that they are not limited to representing existing concepts and relationships. Because oxels can be combined and recombined in endless ways, they are also a powerful tool for creating new concepts and discovering new relationships.

In a sense, oxels are a language for thought itself – a language that not only describes the world, but also helps us to reshape it. So go ahead, dive into the world of oxels and start weaving your own constellations of meaning!

# Semio-dimensional Grammars 📖🔀🧩

*This section would make absurdly huge claims, and the proposed parse/fuse function is not yet satisfactorily implemented, so this section has been left out of this readme and included in this Github Issue: https://github.com/semioverse/semioverse/issues/2* 📝

---

# Meta-linguistic Assertions

"The **role** A plays in **scene** X is functionally pragmatically equivalent (scalar correlation) to the **role** B plays in **scene** Y."
*(This kind of statement can be explicit or implicit in parsing: see semio-dimensional grammars)*

---

# Contributing to this repo! 🤝🧩

**Join the [Play! (telegram)](https://t.me/semioverse) we have weekly gatherings for casting semioversal magic!** *Bring your dreams and visions and lets weave interfaces for them!* 🎭🌍🎲💬

**[Donate to support the development of Play!](https://slice.so/slicer/play "Support Play!")**

## Merge to Earn 💰🔄🧩

This repository uses [Merge to Earn](https://mte.slice.so/) to automate rewarding contributors with a share of ownership over funds sent to  this repository's [slicer](https://slice.so/slicer/play), when pull requests are merged. It enables a transparent, equitable reward system for collaborative and open-source development.

Shares of the Merge to Earn slicer do not represent shares of ownership over this project in any form, rather they represent only shares of the tokens that pass through the slicer.
