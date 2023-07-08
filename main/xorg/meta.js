//Conditional Branching (If-Else Oxel): This Oxel will represent the if-else logic. It might have three children - the "Condition" Oxel, the "True Block" Oxel and the "False Block" Oxel. The Condition Oxel will hold the condition to evaluate. The True Block and False Block Oxels will hold the Oxels to be executed when the condition is true or false, respectively.

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

const actual = new Oxel("actual");
const potential = new Oxel("potential");
const input = new Oxel("input");
const output = new Oxel("output");

// Logical Operators
const ANY = new Oxel("ANY");
const ALL = new Oxel("ALL");
const NOT = new Oxel("NOT");
const OR = new Oxel("OR");
const IMPLY = new Oxel("IMPLY"); // if...then : material implication
const XNOR = new Oxel("XNOR"); // if and only if	: biconditional
const NAND = new Oxel("NAND"); // not both	: alternative denial
const NOR = new Oxel("NOR"); // neither...nor	: joint denial
const NIMPLY = new Oxel("NIMPLY"); //but not	: material nonimplication

let condition = new Oxel("condition");
let trueBlock = new Oxel("trueBlock");
let falseBlock = new Oxel("falseBlock");
const ifElse = await new Oxel("ifElse").weave(
  [condition, trueBlock],
  [condition, falseBlock]
);

//Looping (While Loop Oxel): This Oxel will represent a while loop. It would have two children - the "Condition" Oxel, and the "Loop Block" Oxel, which holds the Oxels to be executed in each loop iteration.
let whileLoop = new Oxel("whileLoop");
let loopBlock = new Oxel("loopBlock");

//Function (Function Oxel): This Oxel represents a function. It has two children - the "Parameters" Oxel and the "Function Block" Oxel. The Parameters Oxel holds one child for each parameter. The Function Block Oxel holds the Oxels that make up the function's code.
let parameters = new Oxel("parameters");
let functionBlock = new Oxel("functionBlock");
const functiono = new Oxel("function").weave([parameterso, functionBlocko]);

//Variable (Variable Oxel): This Oxel represents a variable. Its key would be the variable name and the value would be the variable's value.
let variable = new Oxel("variableName", variableValue);

// Return (Return Oxel): This Oxel represents a return statement. Its value would be the value to be returned.
let returno = new Oxel("return", returnValue);

//Constant (Constant Oxel): This Oxel represents a constant. Its key would be the constant name and the value would be the constant's value.
let constant = new Oxel("constantName", constantValue);

//Parallel Execution (Parallel Oxel): This Oxel represents parallel execution. Each of its children would be executed simultaneously.
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
const story = new Oxel("story");
const lastEvent = new Oxel("lastEvent");
const game = await new Oxel("game").weave([interpreters]);
