import Oxel from "./oxel.js";

const recognizers = new Oxel("recognizers");
const recognizer = new Oxel("recognizer");

// recognition is always recognition of a schema through which to interpret the the thread with the oxel interpretor.
const recognition = new Oxel("recognition");

const actual = new Oxel("actual");
const potential = new Oxel("potential");
const input = new Oxel("input");
const output = new Oxel("output");

const player = new Oxel("player");
const scenes = new Oxel("scenes");
const roles = new Oxel("roles");
const moves = new Oxel("moves");

// add phone number to player card
const phoneNumber = new Oxel("phone number");

const container = new Oxel("container");
const slot = new Oxel("slot");
const trigger = new Oxel("trigger");

const value = new Oxel("value");

const point = new Oxel("point");
const token = new Oxel("token");

const right = new Oxel("right");
const obligation = new Oxel("obligation");
const oxel = new Oxel("oxel");

const story = new Oxel("story");
const event = new Oxel("event");

const asset = new Oxel("asset");
const liability = new Oxel("liability");

const turn = new Oxel("turn");
const characteristic = new Oxel("characteristic");

const card = new Oxel("card");
const title = new Oxel("title");
const description = new Oxel("description");
const deck = new Oxel("deck");
const hand = new Oxel("hand");
const suite = new Oxel("suite");

const offer = new Oxel("offer");
const ask = new Oxel("ask");
const op = new Oxel("op");

const shift = new Oxel("shift");
const replace = new Oxel("replace");

const filter = new Oxel("filter");
const filterLayer = new Oxel("filter-layer");

//Conditional Branching (If-Else Oxel): This Oxel will represent the if-else logic. It might have three values - the "Condition" Oxel, the "True Block" Oxel and the "False Block" Oxel. The Condition Oxel will hold the condition to evaluate. The True Block and False Block Oxels will hold the Oxels to be executed when the condition is true or false, respectively.

const add = new Oxel("add");
const subtract = new Oxel("subtract");
const multiply = new Oxel("multiply");
const divide = new Oxel("divide");

const equalTo = new Oxel("==");
const notEquals = new Oxel("!==");
const greaterThan = new Oxel(">");
const lessThan = new Oxel("<");
const lessThanOrEqualTo = new Oxel("<=");
const greaterThanOrEqualTo = new Oxel(">=");
const equals = new Oxel("equals");
const greater = new Oxel("greater");
const lesser = new Oxel("lesser");
const x = new Oxel("x");
const y = new Oxel("y");

// Oxel instances for all 16 logical connectives
const ANY = new Oxel("ANY");
const ALL = new Oxel("ALL");
const NOT = new Oxel("NOT");
const OR = new Oxel("OR");
const IMPLY = new Oxel("IMPLY"); // if...then : material implication
const XNOR = new Oxel("XNOR"); // if and only if	: biconditional
const NAND = new Oxel("NAND"); // not both	: alternative denial
const NOR = new Oxel("NOR"); // neither...nor	: joint denial
const NIMPLY = new Oxel("NIMPLY"); //but not	: material nonimplication

let T = Oxel("T"); //# True
let F = Oxel("F"); //# False
let T_NOR = Oxel("T_NOR"); //# NOR with True
let F_NAND = Oxel("F_NAND"); //# NAND with False
let T_AND = Oxel("T_AND"); //# AND with True
let F_OR = Oxel("F_OR"); //# OR with False

let logical_connectives = [
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

let condition = new Oxel("condition");
let trueBlock = new Oxel("trueBlock");
let falseBlock = new Oxel("falseBlock");
const ifElse = await new Oxel("ifElse").weave(
  [condition, trueBlock],
  [condition, falseBlock]
);

//Looping (While Loop Oxel): This Oxel will represent a while loop. It would have two values - the "Condition" Oxel, and the "Loop Block" Oxel, which holds the Oxels to be executed in each loop iteration.
let whileLoop = new Oxel("whileLoop");
let loopBlock = new Oxel("loopBlock");

//Function (Function Oxel): This Oxel represents a function. It has two values - the "Parameters" Oxel and the "Function Block" Oxel. The Parameters Oxel holds one child for each parameter. The Function Block Oxel holds the Oxels that make up the function's code.
let parameters = new Oxel("parameters");
let functionBlock = new Oxel("functionBlock");
const functiono = new Oxel("function").weave([parameters, functionBlock]);

//Variable (Variable Oxel): This Oxel represents a variable. Its key would be the variable name and the value would be the variable's value.
let variable = new Oxel("variableName", variableValue);

// Return (Return Oxel): This Oxel represents a return statement. Its value would be the value to be returned.
let returno = new Oxel("return", returnValue);

//Constant (Constant Oxel): This Oxel represents a constant. Its key would be the constant name and the value would be the constant's value.
let constant = new Oxel("constantName", constantValue);

//Parallel Execution (Parallel Oxel): This Oxel represents parallel execution. Each of its values would be executed simultaneously.
let parallelOxel = new Oxel("parallel");

// Exception Handling
let tryo = new Oxel("try");
let catcho = new Oxel("catch", exceptionType);
let finallyo = new Oxel("finally");
await tryo.weave(["Catch", catcho], ["Finally", finallyo]);

// Comment Oxel:
let comment = new Oxel("comment", commentText);

// Compare Oxel
const compare = await new Oxel("compare").weave(
  [parameters, x, <x-value></x-value>],
  [parameters, y, <y-value></y-value>],
  [functionBlock, ifElse, condition, x, greaterThan, y],
  [functionBlock, ifElse, trueBlock, returno, greater],
  [functionBlock, ifElse, falseBlock, ifElse, condition, x, equalTo, y],
  [functionBlock, ifElse, falseBlock, ifElse, trueBlock, greater],
  [functionBlock, ifElse, falseBlock, ifElse, falseBlock, lesser]
);

const interpreters = new Oxel("interpretors");
const lastEvent = new Oxel("lastEvent");

const KeyDive = new Oxel("Key Dive");
const Backtrack = new Oxel("Backtrack"); // This Oxel could take you back to the previous Oxel visited. This would involve maintaining some sort of history or stack of visited Oxels.
const RandomWalk = new Oxel("Random Walk"); // This Oxel could randomly choose the next Oxel to visit from the current Oxel's neighbors. This is useful for stochastic processes or simply for exploring the graph.
const ShortestPath = new Oxel("Shortest Path"); // Given a specific destination Oxel, this Oxel could navigate the shortest path to that destination. This would involve implementing a shortest path algorithm like Dijkstra's.
const BreadthFirstSearch = new Oxel("Breadth First Search"); //These Oxels could traverse the graph using breadth-first search strategies, respectively.
const DepthFirstSearch = new Oxel("Depth First Search"); //These Oxels could traverse the graph using depth-first search strategies, respectively.
const HighestDegree = new Oxel("Highest Degree"); //This Oxel could choose to navigate to the neighboring Oxel that has the highest degree (i.e., the most connections). This might be useful in network analysis or graph-based recommendation systems.
const CustomCondition = new Oxel("Custom Condition"); //This Oxel could navigate based on a custom condition, such as moving to the neighboring Oxel that has a certain property or value.
const CyclicRotation = new Oxel("Cyclic Rotation"); // In a circular or cyclic structure, this Oxel could perform rotations, moving to the next Oxel in the cycle.

const navOxels = [
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

const dungeon = new Oxel("dungeon");
const megaDungeon = new Oxel("mega-dungeon");

const board = new Oxel("board");
const playingBoard = new Oxel("playing board");

const portal = new Oxel("portal");
const map = new Oxel("map");
const path = new Oxel("path");
const dotsOnPath = new Oxel("dots on path");
const stacks = new Oxel("stacks");
const sides = new Oxel("sides");
const edges = new Oxel("edges");
