Complete this ASCII Representation of Abstract Syntax Trees for each of these programming constructs:

// Arithmetic operators
add
  ├── "x"
  └── "y"

subtract
  ├── "x"
  └── "y"

multiply
  ├── "x"
  └── "y"

divide
  ├── "x"
  └── "y"

modulus
├── "x"
└── "y"

// Comparison operators
equalTo
  ├── "x"
  └── "y"

notEquals
  ├── "x"
  └── "y"

greaterThan
  ├── "x"
  └── "y"

lessThan
  ├── "x"
  └── "y"

lessThanOrEqualTo
  ├── "x"
  └── "y"

greaterThanOrEqualTo
  ├── "x"
  └── "y"

isNot
├── "x"
└── "y"

// Logical Operators
ANY
  ├── "x"
  └── "y"

ALL
  ├── "x"
  └── "y"

NOT
  └── "x"

OR
  ├── "x"
  └── "y"

IMPLY
  ├── "x" (condition)
  └── "y" (result if condition is true)

// Logical Operators
XOR
├── "x"
└── "y"

XNOR
├── "x"
└── "y"

NAND
├── "x"
└── "y"

NOR
├── "x"
└── "y"

NIMPLY
├── "x"
└── "y"

// Conditional structures
ifElse
  ├── "condition"
  ├── "trueBlock"
  └── "falseBlock"

whileLoop
  ├── "condition"
  └── "loopBlock"

// Conditional structures
forLoop
├── "init"
├── "condition"
└── "iteration"

// Function-related constructs
function
  ├── "parameters"
  └── "functionBlock"

  functionCall
  ├── "functionName"
  └── "arguments"

// Return statement
returno
  └── "output"

  // Assignment
  ant
  ├── "antName"
  └── "antValue"

// Variable assignment
variable
  ├── "antName"
  └── "antValue"

// Error handling constructs with exception type
catcho
├── "catch"
└── "exceptionType"

finallyo
└── "finally"

// Error handling constructs
tryo
  ├── "try"
  ├── "catcho"
  └── "finallyo"

// Error handling constructs
throwo
└── "exception"

// Comments (Note: Comments usually aren't part of AST, but included for completeness)
comment
├── "comment"
└── "commentText"

// Comments (Note: Comments usually aren't part of AST, but included for completeness)
multiLineComment
├── "startComment"
└── "endComment"

// Data structures
arrayDeclaration
├── "arrayName"
└── "arrayElements"

objectDeclaration
├── "objectName"
└── "objectProperties"

// Parallel Execution
concurrent
├── "task1"
└── "task2"
. .
. .
. .
└── "taskN"

parallel
├── "task1"
└── "task2"
.   .
.   .
.   .
└── "taskN"

// Import and Export
importStatement
├── "module"
└── "importedElements"

exportStatement
└── "exportedElement"

// Bitwise Operators
bitwiseAnd
├── "x"
└── "y"

bitwiseOr
├── "x"
└── "y"

bitwiseXor
├── "x"
└── "y"

bitwiseNot
└── "x"

shiftLeft
├── "x"
└── "y"

shiftRight
├── "x"
└── "y"

// Unary Operators
unaryMinus
└── "x"

unaryPlus
└── "x"

// Ternary Operator
ternary
├── "condition"
├── "trueBlock"
└── "falseBlock"

// Increment and Decrement
increment
└── "x"

decrement
└── "x"

// Function-related constructs
lambdaFunction
├── "parameters"
└── "functionBlock"

// Variable declaration
declaration
├── "varName"
└── "varType"

// Constant declaration
constant
├── "constName"
└── "constValue"

// Switch case statement
switch
├── "switchVar"
├── "case1"
├── "case2"
. .
. .
└── "defaultCase"

// Loop structures
doWhileLoop
├── "condition"
└── "loopBlock"

// Async-await
asyncFunction
├── "parameters"
└── "functionBlock"

awaitExpression
└── "promise"

// Generator function
generatorFunction
├── "parameters"
└── "functionBlock"

yieldExpression
└── "yieldValue"

// List comprehension
listComprehension
├── "expression"
├── "variable"
└── "inputSequence"

// Null and undefined
null
└── "variable"

undefined
└── "variable"

// Block of statements
block
├── "statement1"
├── "statement2"
. .
. .
└── "statementN"

// Control Flow Structures

continueStatement
└── "label" (optional)

breakStatement
└── "label" (optional)

// Class-related Constructs
classDeclaration
├── "className"
├── "classBody"
└── "parentClass" (optional)

methodDeclaration
├── "methodName"
├── "parameters"
└── "methodBody"

constructorDeclaration
├── "parameters"
└── "constructorBody"

// Import and Export
defaultExport
└── "exportedElement"

// Data structures
dictionaryDeclaration
├── "dictionaryName"
└── "dictionaryElements"

// String concatenation
concatenate
├── "string1"
└── "string2"

// String interpolation
interpolate
├── "templateString"
└── "substitutions"

// Array index
arrayIndex
├── "arrayName"
└── "index"

// Type casting
cast
├── "value"
└── "newType"

// Memory allocation and deallocation
malloc
└── "size"

free
└── "pointer"

// Pointer dereference and address-of
dereference
└── "pointer"

addressOf
└── "variable"

// Field access (for objects and structs)
fieldAccess
├── "objectName"
└── "fieldName"

// Enum Declaration
enumDeclaration
├── "enumName"
└── "enumValues"

// Scope Constructs
blockScope
├── "blockStatement1"
├── "blockStatement2"
. .
. .
└── "blockStatementN"

globalScope
└── "program"

// Struct Declaration
structDeclaration
├── "structName"
└── "structFields"

// Module System
moduleDeclaration
├── "moduleName"
└── "moduleBody"

importDeclaration
├── "importedModule"
└── "importedSymbols"

exportDeclaration
└── "exportedSymbols"

// Object instantiation
newInstance
├── "className"
└── "arguments"

// Event handling
addEventListener
├── "element"
├── "eventType"
└── "listenerFunction"

removeEventListener
├── "element"
├── "eventType"
└── "listenerFunction"

// Data Structures
linkedListDeclaration
├── "linkedListName"
└── "linkedListElements"

queueDeclaration
├── "queueName"
└── "queueElements"

stackDeclaration
├── "stackName"
└── "stackElements"

// Collection Operations
pushToStack
├── "stackName"
└── "element"

popFromStack
└── "stackName"

enqueueToQueue
├── "queueName"
└── "element"

dequeueFromQueue
└── "queueName"

// Generic Node
genericNode
├── "nodeKey"
└── "nodeValue"

// File Operations
fileOpen
├── "filePath"
└── "accessMode"

fileClose
└── "fileObject"

fileRead
├── "fileObject"
└── "readSize" (optional)

fileWrite
├── "fileObject"
└── "writeData"

// Input & Output Operations
print
└── "printArgument"

readInput
└── "variableName"

// Interfaces (In the context of object-oriented programming)
interfaceDeclaration
├── "interfaceName"
└── "interfaceBody"

// Decorator/Annotation (In the context of programming languages like Python or Java)
decorator
├── "decoratorName"
└── "target"

// Pattern Matching
matchExpression
├── "matchedExpression"
├── "case1"
├── "case2"
. .
. .
└── "defaultCase"

// Record Declaration (In the context of functional programming languages like Haskell or Elm)
recordDeclaration
├── "recordName"
└── "recordFields"

// Union Types (In the context of functional programming languages)
unionTypeDeclaration
├── "unionName"
└── "typeAlternatives"

// Generic Type Parameters
genericTypeParameter
├── "typeName"
└── "typeConstraints"

// List slicing (In the context of languages like Python)
listSlice
├── "listName"
├── "startIndex" (optional)
├── "endIndex" (optional)
└── "step" (optional)

// Property access (For languages with dot notation)
propertyAccess
├── "object"
└── "propertyName"

// Function composition (In the context of functional programming)
functionComposition
├── "function1"
└── "function2"

// Pipeline (In the context of shell scripting or functional programming)
pipeline
├── "operation1"
├── "operation2"
. .
. .
└── "operationN"

// Map, Filter, Reduce (In the context of functional programming)
mapFunction
├── "function"
└── "list"

filterFunction
├── "function"
└── "list"

reduceFunction
├── "function"
├── "list"
└── "initialValue"

// Functional Programming Constructs

// Function Application
applyFunction
├── "function"
└── "argument"

// High-Order Function
highOrderFunction
├── "function"
└── "functionOrValue"

// Currying
currying
├── "function"
└── "partialArguments"

// Lazy Evaluation
lazyEvaluation
└── "expression"

// Tail Recursion
tailRecursion
├── "recursiveFunction"
└── "parameters"

// Lambda Calculus
lambdaCalculus
├── "lambdaExpression"
└── "variableOrValue"

// Monads
monad
├── "value"
└── "bindOperation"

// Functors
functor
├── "value"
└── "mapOperation"

// Pure Functions
pureFunction
├── "function"
└── "parameters"

// Combinators
combinator
├── "function1"
└── "function2"

// Function Chaining
functionChaining
├── "function1"
├── "function2"
. .
. .
└── "functionN"

// Option Type
optionType
├── "someValue"
└── "none"

// Pattern Matching
patternMatch
├── "value"
├── "pattern1"
├── "pattern2"
. .
. .
└── "defaultPattern"

// Guards
guardExpression
├── "condition"
└── "expression"

// Infinite Data Structures
infiniteDataStructure
└── "generatorFunction"

// Algebraic Data Types
algebraicDataType
├── "typeName"
└── "typeAlternatives"

// Function Composition
compose
├── "function1"
└── "function2"

// Partial Application
partialApplication
├── "function"
└── "partiallyAppliedArgs"

// Relational Programming Constructs

// Relation Declaration
relationDeclaration
├── "relationName"
└── "attributes"

// Tuple Declaration
tupleDeclaration
├── "tupleName"
└── "elements"

// Relation Selection
select
├── "condition"
└── "relation"

// Relation Projection
project
├── "attributeList"
└── "relation"

// Cartesian Product
cartesianProduct
├── "relation1"
└── "relation2"

// Join Operations
naturalJoin
├── "relation1"
└── "relation2"

leftJoin
├── "relation1"
└── "relation2"

rightJoin
├── "relation1"
└── "relation2"

fullJoin
├── "relation1"
└── "relation2"

// Division
division
├── "relation1"
└── "relation2"

// Set Operations
union
├── "relation1"
└── "relation2"

intersection
├── "relation1"
└── "relation2"

difference
├── "relation1"
└── "relation2"

// Aggregation Operations
aggregate
├── "aggregateFunction"
└── "relation"

// Recursive Query
recursiveQuery
├── "baseCase"
└── "recursiveStep"

// Existential Quantification
exists
├── "variable"
└── "relation"

// Universal Quantification
forall
├── "variable"
└── "relation"

// Conditional Expressions
conditionalExpression
├── "condition"
├── "trueExpression"
└── "falseExpression"

// Relational Assignment
relationalAssignment
├── "relation"
└── "expression"

// Views
createView
├── "viewName"
└── "query"

// Grouping
group
├── "relation"
├── "groupingAttributes"
└── "aggregateFunctions"

// Rename
rename
├── "relation"
├── "oldAttributeName"
└── "newAttributeName"

// Constraints
constraint
├── "constraintName"
└── "constraintCondition"

// Update Operations
insertInto
├── "relation"
└── "tuple"

deleteFrom
├── "relation"
└── "condition"

update
├── "relation"
├── "updates"
└── "condition"

// SQL Specific Constructs
sqlQuery
├── "selectClause"
├── "fromClause"
├── "whereClause" (optional)
├── "groupByClause" (optional)
├── "havingClause" (optional)
└── "orderByClause" (optional)

// Relational Programming Constructs

// Nullability Check
isNull
└── "attribute"

// Not Null Check
isNotNull
└── "attribute"

// Order By
orderBy
├── "relation"
└── "orderAttributes"

// Limit
limit
├── "relation"
└── "count"

// Subquery
subquery
├── "relationName"
└── "query"

// String Operations
like
├── "attribute"
└── "pattern"

// Concatenation
concat
├── "attribute1"
└── "attribute2"

// Case Insensitive Like
ilike
├── "attribute"
└── "pattern"

// String Length
length
└── "attribute"

// Extract Substring
substring
├── "attribute"
├── "startPosition"
└── "length"

// Convert to Upper Case
toUpperCase
└── "attribute"

// Convert to Lower Case
toLowerCase
└── "attribute"

// Trim Whitespaces
trim
└── "attribute"

// Numeric Operations
abs
└── "attribute"

// Round
round
└── "attribute"

// Floor
floor
└── "attribute"

// Ceiling
ceil
└── "attribute"

// Date and Time Operations
currentDate
currentTimestamp
datePart
├── "part"
└── "dateAttribute"

// Cast Operations
cast
├── "attribute"
└── "type"

// Alias
alias
├── "attribute"
└── "aliasName"

// Distinct Selection
distinct
└── "relation"

// In
in
├── "attribute"
└── "valueList"

// Between
between
├── "attribute"
├── "lowerValue"
└── "upperValue"

// SQL Joins
innerJoin
├── "relation1"
├── "relation2"
└── "joinCondition"

outerJoin
├── "relation1"
├── "relation2"
└── "joinCondition"

crossJoin
├── "relation1"
└── "relation2"

selfJoin
├── "relation"
└── "alias"

// Having
having
├── "groupByClause"
└── "havingCondition"

// Transactions
beginTransaction
commitTransaction
rollbackTransaction

// SQL Stored Procedures and Functions
createProcedure
├── "procedureName"
├── "parameters" (optional)
└── "procedureBody"

callProcedure
├── "procedureName"
└── "parameters" (optional)

createFunction
├── "functionName"
├── "parameters" (optional)
├── "returnType"
└── "functionBody"

callFunction
├── "functionName"
└── "parameters" (optional)

// Indexes
createIndex
├── "indexName"
├── "tableName"
└── "columnNames"

dropIndex
└── "indexName"

// SQL Triggers
createTrigger
├── "triggerName"
├── "tableName"
├── "triggerTime"
├── "triggerEvent"
└── "actionStatement"

dropTrigger
└── "triggerName"

// DOM (Document Object Model) API Constructs

// Document Methods
createElement
└── "tagName"

createTextNode
└── "data"

getElementById
└── "id"

getElementsByClassName
└── "className"

getElementsByTagName
└── "tagName"

querySelector
└── "selectors"

querySelectorAll
└── "selectors"

// Node Methods
appendChild
├── "parentNode"
└── "newChildNode"

removeChild
├── "parentNode"
└── "childNode"

replaceChild
├── "parentNode"
├── "newChild"
└── "oldChild"

cloneNode
├── "originalNode"
└── "deep" (boolean)

insertBefore
├── "parentNode"
├── "newNode"
└── "referenceNode"

contains
├── "parentNode"
└── "childNode"

hasChildNodes
└── "node"

// Element Methods
getAttribute
├── "element"
└── "attributeName"

setAttribute
├── "element"
├── "attributeName"
└── "value"

removeAttribute
├── "element"
└── "attributeName"

hasAttribute
├── "element"
└── "attributeName"

classList.add
├── "element"
└── "className"

classList.remove
├── "element"
└── "className"

classList.toggle
├── "element"
└── "className"

classList.contains
├── "element"
└── "className"

addEventListener
├── "element"
├── "type"
└── "listener"

removeEventListener
├── "element"
├── "type"
└── "listener"

// Window Methods
setTimeout
├── "function"
└── "delay"

setInterval
├── "function"
└── "interval"

clearTimeout
└── "timeoutId"

clearInterval
└── "intervalId"

fetch
├── "url"
└── "options" (optional)

alert
└── "message"

confirm
└── "message"

prompt
└── "message"

// Special Attributes
style
├── "element"
├── "property"
└── "value"

innerHTML
├── "element"
└── "htmlString"

textContent
├── "element"
└── "text"

value
├── "inputElement"
└── "value"

checked
├── "inputCheckboxOrRadio"
└── "checked" (boolean)

selected
├── "optionElement"
└── "selected" (boolean)

disabled
├── "formControlElement"
└── "disabled" (boolean)
