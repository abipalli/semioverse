import Oxel from "./oxel.js";

export const recognizers = new Oxel("recognizers");
export const recognizer = new Oxel("recognizer");

// recognition is always recognition of a schema through which to interpret the the thread with the oxel interpretor.
export const recognition = new Oxel("recognition");

export const actual = new Oxel("actual");
export const potential = new Oxel("potential");
export const inputs = new Oxel("inputs");
export const outputs = new Oxel("outputs");

export const goals = new Oxel("goals");

export const networks = new Oxel("networks");

export const players = new Oxel("players");
export const scenes = new Oxel("scenes");
export const roles = new Oxel("roles");
export const moves = new Oxel("moves");

// add phone number to player card
export const phoneNumber = new Oxel("phone number");

export const containers = new Oxel("containers");
export const slots = new Oxel("slot");
export const triggers = new Oxel("trigger");

export const values = new Oxel("values");

export const points = new Oxel("points");
export const tokens = new Oxel("tokens");

export const rights = new Oxel("rights");
export const obligations = new Oxel("obligations");

export const stories = new Oxel("stories");
export const story = new Oxel("story");
export const events = new Oxel("events");
export const event = new Oxel("event");

export const assets = new Oxel("assets");
export const liabilities = new Oxel("liabilities");

export const turns = new Oxel("turns");
export const characteristics = new Oxel("characteristics");

export const card = new Oxel("card");
export const title = new Oxel("title");
export const description = new Oxel("description");
export const deck = new Oxel("deck");
export const hand = new Oxel("hand");
export const suite = new Oxel("suite");

export const offers = new Oxel("offers");
export const asks = new Oxel("asks");
export const op = new Oxel("op");

export const oxels = new Oxel("oxels");
export const thread = new Oxel("thread");
export const weave = new Oxel("weave");
export const hasThread = new Oxel("hasThread");
export const hasWeave = new Oxel("hasWeave");
export const shift = new Oxel("shift");
export const replace = new Oxel("replace");

export const filter = new Oxel("filter");
export const filterLayer = new Oxel("filter-layer");

//Conditional Branching (If-Else Oxel): This Oxel will represent the if-else logic. It might have three values - the "Condition" Oxel, the "True Block" Oxel and the "False Block" Oxel. The Condition Oxel will hold the condition to evaluate. The True Block and False Block Oxels will hold the Oxels to be executed when the condition is true or false, respectively.

export const add = new Oxel("add");
export const subtract = new Oxel("subtract");
export const multiply = new Oxel("multiply");
export const divide = new Oxel("divide");

export const equalTo = new Oxel("==");
export const notEquals = new Oxel("!==");
export const greaterThan = new Oxel(">");
export const lessThan = new Oxel("<");
export const lessThanOrEqualTo = new Oxel("<=");
export const greaterThanOrEqualTo = new Oxel(">=");
export const equals = new Oxel("equals");
export const greater = new Oxel("greater");
export const lesser = new Oxel("lesser");
export const x = new Oxel("x");
export const y = new Oxel("y");

// Oxel instances for all 16 logical connectives
export const ANY = new Oxel("ANY");
export const ALL = new Oxel("ALL");
export const NOT = new Oxel("NOT");
export const OR = new Oxel("OR");
export const IMPLY = new Oxel("IMPLY"); // if...then : material implication
export const XNOR = new Oxel("XNOR"); // if and only if	: biconditional
export const NAND = new Oxel("NAND"); // not both	: alternative denial
export const NOR = new Oxel("NOR"); // neither...nor	: joint denial
export const NIMPLY = new Oxel("NIMPLY"); //but not	: material nonimplication

export const T = Oxel("T"); //# True
export const F = Oxel("F"); //# False
export const T_NOR = Oxel("T_NOR"); //# NOR with True
export const F_NAND = Oxel("F_NAND"); //# NAND with False
export const T_AND = Oxel("T_AND"); //# AND with True
export const F_OR = Oxel("F_OR"); //# OR with False

export const logical_connectives = [
  AND,
  OR,
  NOT,
  NOR,
  NAND,
  XOR,
  XNOR,
  IMPLY,
  NIMPLY,
  IF_AND_ONLY_IF,
  NIF_AND_ONLY_IF,
  T,
  F,
  T_NOR,
  F_NAND,
  T_AND,
  F_OR,
];

export const condition = new Oxel("condition");
export const trueBlock = new Oxel("trueBlock");
export const falseBlock = new Oxel("falseBlock");
export const ifElse = new Oxel("ifElse");
await ifElse.weave([condition, trueBlock], [condition, falseBlock]);

//Looping (While Loop Oxel): This Oxel will represent a while loop. It would have two values - the "Condition" Oxel, and the "Loop Block" Oxel, which holds the Oxels to be executed in each loop iteration.
export const whileLoop = new Oxel("whileLoop");
export const loopBlock = new Oxel("loopBlock");
await whileLoop.weave([condition, loopBlock]);

//Function (Function Oxel): This Oxel represents a function. It has two values - the "Parameters" Oxel and the "Function Block" Oxel. The Parameters Oxel holds one child for each parameter. The Function Block Oxel holds the Oxels that make up the function's code.
export const parameters = new Oxel("parameters");
export const functionBlock = new Oxel("functionBlock");
export const functiono = new Oxel("function");
await functiono.weave([parameters, functionBlock]);

//Variable (Variable Oxel): This Oxel represents a variable. Its key would be the variable name and the value would be the variable's value.
export const variable = new Oxel("variableName", variableValue);

// Return (Return Oxel): This Oxel represents a return statement. Its value would be the value to be returned.
export const returno = new Oxel("return", returnValue);

//Constant (Constant Oxel): This Oxel represents a export constant. Its key would be the export constant name and the value would be the export constant's value.
export const constant = new Oxel(" constantName", constantValue);

//Parallel Execution (Parallel Oxel): This Oxel represents parallel execution. Each of its values would be executed simultaneously.
export const parallelOxel = new Oxel("parallel");

// Exception Handling
export const tryo = new Oxel("try");
export const catcho = new Oxel("catch", exceptionType);
export const finallyo = new Oxel("finally");
await tryo.weave(["Catch", catcho], ["Finally", finallyo]);

// Comment Oxel:
export const comment = new Oxel("comment", commentText);

// Compare Oxel
export const compare = await new Oxel("compare").weave(
  [parameters, x, <x-value></x-value>],
  [parameters, y, <y-value></y-value>],
  [functionBlock, ifElse, condition, x, greaterThan, y],
  [functionBlock, ifElse, trueBlock, returno, greater],
  [functionBlock, ifElse, falseBlock, ifElse, condition, x, equalTo, y],
  [functionBlock, ifElse, falseBlock, ifElse, trueBlock, greater],
  [functionBlock, ifElse, falseBlock, ifElse, falseBlock, lesser]
);

export const interpreters = new Oxel("interpretors");
export const lastEvent = new Oxel("lastEvent");

export const KeyDive = new Oxel("Key Dive");
export const Backtrack = new Oxel("Backtrack"); // This Oxel could take you back to the previous Oxel visited. This would involve maintaining some sort of history or stack of visited Oxels.
export const RandomWalk = new Oxel("Random Walk"); // This Oxel could randomly choose the next Oxel to visit from the current Oxel's neighbors. This is useful for stochastic processes or simply for exploring the graph.
export const ShortestPath = new Oxel("Shortest Path"); // Given a specific destination Oxel, this Oxel could navigate the shortest path to that destination. This would involve implementing a shortest path algorithm like Dijkstra's.
export const BreadthFirstSearch = new Oxel("Breadth First Search"); //These Oxels could traverse the graph using breadth-first search strategies, respectively.
export const DepthFirstSearch = new Oxel("Depth First Search"); //These Oxels could traverse the graph using depth-first search strategies, respectively.
export const HighestDegree = new Oxel("Highest Degree"); //This Oxel could choose to navigate to the neighboring Oxel that has the highest degree (i.e., the most connections). This might be useful in network analysis or graph-based recommendation systems.
export const CustomCondition = new Oxel("Custom Condition"); //This Oxel could navigate based on a custom condition, such as moving to the neighboring Oxel that has a certain property or value.
export const CyclicRotation = new Oxel("Cyclic Rotation"); // In a circular or cyclic structure, this Oxel could perform rotations, moving to the next Oxel in the cycle.

export const navOxels = [
  KeyDive,
  Backtrack,
  RandomWalk,
  ShortestPath,
  BreadthFirstSearch,
  DepthFirstSearch,
  HighestDegree,
  CustomCondition,
  CyclicRotation,
];

export const dungeon = new Oxel("dungeon");
export const megaDungeon = new Oxel("mega-dungeon");

export const board = new Oxel("board");
export const playingBoard = new Oxel("playing board");

export const portal = new Oxel("portal");
export const map = new Oxel("map");
export const path = new Oxel("path");
export const dotsOnPath = new Oxel("dots on path");
export const stacks = new Oxel("stacks");
export const sides = new Oxel("sides");
export const edges = new Oxel("edges");
