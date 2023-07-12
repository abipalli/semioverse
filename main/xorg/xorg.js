import Oxel from "../oxel.js";

const setting = new Oxel("setting");
const scene = new Oxel("scene");
const role = new Oxel("role");
const move = new Oxel("move");

const scenes = new Oxel("scenes");
const roles = new Oxel("roles");
const moves = new Oxel("moves");

const actual = new Oxel("actual");
const potential = new Oxel("potential");
const input = new Oxel("input");
const output = new Oxel("output");

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
const op = new Oxel("op");

const shift = new Oxel("shift");
const replace = new Oxel("replace");

const filter = new Oxel("filter");
const filterLayer = new Oxel("filter-layer");

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

// -------------------------------------------------------

async function composeOxels() {
  const gameState = new Oxel("gameState");

  // A game setting contains scenes and roles
  await gameState.thread(setting, scenes);
  await gameState.thread(setting, roles);

  // Each scene has potential moves
  await gameState.thread(scene, potential, moves);

  // A role can take an actual move, creating an output from an input
  await gameState.thread(role, actual, move, input);
  await gameState.thread(role, actual, move, output);

  // A move can shift the state of the game and involve a specific role
  await gameState.thread(move, shift, gameState);
  await gameState.thread(move, role);

  // The game contains a container, which contains slots. Each slot has a token, and each token has a value.
  await gameState.thread(gameState, container, slot, token, value);

  // A token has an obligation (right) to follow certain operations (ops)
  await gameState.thread(token, obligation, op);

  // A card in the game has a title and a description
  await gameState.thread(card, title);
  await gameState.thread(card, description);

  // The game has a deck of cards and each player has a hand of cards
  await gameState.thread(gameState, deck);
  // assuming a player is a role in this context
  await gameState.thread(role, hand);

  // Each role in the game may offer specific ops
  await gameState.thread(role, offer, op);

  // There are filter layers that affect roles' operations
  await gameState.thread(filterLayer, role, op);

  // There's a dungeon which is a specific type of scene in the game, and it might have several levels (mega-dungeon)
  await gameState.thread(dungeon, scene);
  await gameState.thread(megaDungeon, dungeon);

  // The game has a playing board which is mapped, and each path on the map has dots
  await gameState.thread(playingBoard, map);
  await gameState.thread(path, dotsOnPath);

  // Stacks, sides, and edges are characteristics of the board
  await gameState.thread(playingBoard, characteristic, stacks);
  await gameState.thread(playingBoard, characteristic, sides);
  await gameState.thread(playingBoard, characteristic, edges);

  // A portal may be present on the board that changes the state of the game when a token enters it
  await gameState.thread(playingBoard, portal, token, shift, gameState);

  return gameState;
}

console.log(await composeOxels());
