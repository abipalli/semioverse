const isEmpty = function (arr) {
  return arr.length == 0;
};

const notEmpty = function (arr) {
  return arr.length > 0;
};

function compareBids(a, b) {
  return a.priority - b.priority;
}

class EventDictionary extends Map {
  constructor(...args) {
    super(args);
  }

  addEventReference(eventType, narrativeRef) {
    if (!this.has(eventType)) {
      this.set(eventType, []);
    }
    this.get(eventType).push(narrativeRef);
  }

  getNarrativesForEvent(eventType) {
    return this.get(eventType) || [];
  }

  removeEventReference(eventType, narrativeRef) {
    if (this.has(eventType)) {
      const refs = this.get(eventType);
      const index = refs.indexOf(narrativeRef);
      if (index !== -1) {
        refs.splice(index, 1);
        if (refs.length === 0) {
          this.delete(eventType);
        }
      }
    }
  }

  clearEventReferences() {
    this.clear();
  }
}

export class Card extends Map {
  constructor(name, ...args) {
    super(...args);
    this.name = name;
    this.positions = new Set();
    this.transforms = new Set();
    this.expressions = new Set();
  }

  async thread(...paths) {
    let map = this;
    let initmap = map;
    for await (const path of paths) {
      if (map instanceof Map || map instanceof Card) {
        if (Array.isArray(path)) {
          const [actualPath, rule] = path;
          if (typeof rule === "function" && !rule()) {
            break;
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
      } else {
        console.log("map is not instanceof Map or Card");
        break;
      }
    }
    return initmap;
  }

  async weave(...threads) {
    // It takes in an array of arrays, where each array represents a thread of paths to be weaved.
    for (const thread of threads) {
      await this.thread(...thread);
    }
  }
  async *navigate(pathsOrGenerator) {
    // Handles both an iterable or an asynchronous generator
    let currentCard = this;
    let previousCard = null;

    const pathsIterator =
      Symbol.iterator in pathsOrGenerator
        ? pathsOrGenerator[Symbol.iterator]()
        : pathsOrGenerator;

    for await (let { value: path, done } of pathsIterator) {
      if (!done) {
        if (path === "metaphor-dive") {
          const peek = pathsIterator.next();
          if (!peek.done && currentCard.has(peek.value)) {
            const nextPath = peek.value;
            const nextCard = currentCard.get(nextPath);
            if (nextCard instanceof Map || nextCard instanceof Card) {
              previousCard = currentCard;
              currentCard = nextCard;
              path = nextPath;
            }
          }
        } else if (currentCard.has(path)) {
          previousCard = currentCard;
          currentCard = currentCard.get(path);
        } else {
          return;
        }

        if (previousCard) {
          let positions = currentCard.positions;
          if (!positions) {
            positions = new Set();
            currentCard.positions = positions;
          }
          positions.add(previousCard);
        }

        yield currentCard;
      }
    }
  }

  async *replace(substitute, destinationkey, ...routes) {
    for await (const route of routes) {
      let iterator = this.navigate(route); // we should ensure that route is an iterable or an async generator
      let result = await iterator.next();
      while (!result.done) {
        let nextResult = await iterator.next();
        if (nextResult.done && result.value.has(destinationkey)) {
          result.value.set(destinationkey, new Card());
          result.value.get(destinationkey).set("value", substitute);
        } else if (nextResult.done) {
          continue;
        }
        result = nextResult;
      }
    }
  }

  // Apply all associated transforms to this card and return the transformed cards
  transform() {
    //transform(): This method applies all the Transformations that have been linked to the Card. For each Transformation in the Card's "transforms" Set, it invokes the applyTo method of the Transformation, passing in the Card itself. This effectively transforms the Card according to each Transformation. Each transformation returns a new Card, and all the resulting transformed Cards are collected into an array.
    const transformedCards = [];
    for (const transform of this.transforms) {
      transformedCards.push(transform.get("applyTo")(this));
    }
    return transformedCards;
  }

  async *pathsGenerator(interpreter) {
    // This method is a generator that interprets the expressions on the current card based on the provided interpreter function.
    while (true) {
      const interpretation = await interpreter(this);
      if (interpretation === null || interpretation === undefined) {
        break;
      }
      yield interpretation;
    }
  }
}

class Game extends Card {
  constructor(...args) {
    super(args);
    this._messages = [];
    this._games = [];
    this._story = [];
    //this._expressions = new Set();
    this._running = [];
    this._pending = [];
    this._lastEvent = undefined;
    this._disabled = []; // List of currently disabled elements
    this._eventDictionary = new EventDictionary();
  }

  get messages() {
    return [...this._messages];
  }

  get games() {
    return [...this._games];
  }

  get story() {
    return [...this._story];
  }
  /*
  get expressions() {
    return new Set(this._expressions);
  }
*/
  get running() {
    return [...this._running];
  }

  get pending() {
    return [...this._pending];
  }

  get lastEvent() {
    return this._lastEvent;
  }

  get disabled() {
    return [...this._disabled];
  }

  get eventDictionary() {
    return this._eventDictionary;
  }

  newGame() {
    this._games.push(new Game());
  }

  addGame(game) {
    if (game instanceof Game) {
      this._games.push(game);
    }
  }

  send(message) {
    // Validate and process the message as needed
    this._messages.push(message);
  }

  getNarrativesForEvent(eventType) {
    return this._eventDictionary.getNarrativesForEvent(eventType);
  }

  async express(...threads) {
    // Input Schema: [_Source/Target/Expressions_] : [_Plaything_] : [Scenes] : [_Scene_] : [Roles] : [_Role_]: [Moves] : [_Move_]
    // a thread is an iterable of values, or object-references.
    let expr = new Card();
    expr.set("sources", new Card());
    expr.set("targets", new Card());

    for (const thrd of threads) {
      await thread(expr, ...thrd); // assuming each thread is an array, spread it as arguments
    }

    for (const key of expr.keys()) {
      let value = expr.get(key);
      if (value instanceof Map || value instanceof Card) {
        // we make the assumption that the second nested key after sources, targets, and expressions
        // is always scenes
        for (const scene of expr.get(key)) {
          let sceneMap = scene[1].get("scenes");
          if (!sceneMap.expressions) {
            sceneMap.expressions.add(expr);
          } else {
            sceneMap.expressions.add(expr);
          }
        }
      }
    }
    console.log(expr);
    return expr;
  }

  async addNarrative(name, prio, fun) {
    var bound = fun.bind({
      lastEvent: () => this.lastEvent,
      express: async (...threads) => this.express(...threads),
      // this allows narratives to access the story, the expressions, and express function, thread, weave
      expressions: new Set(),
      gameExpressions: this.expressions,
      messages: this.messages,
      games: this.games,
      story: this.story,
      running: this.running,
      pending: this.pending,
      disabled: this.disabled,
      eventDictionary: this.eventDictionary,
    });
    var nar = await bound(); // Activate the async generator
    var bid = {
      name: name,
      priority: prio,
      narrative: nar,
      expressions: new Set(),
      stepIndex: 0, // Initialize step index
    };
    this._running.push(bid);
    // Add event references to the dictionary
    /*const eventTypes = this.extractEventTypesFromNarrative([...nar]);
            eventTypes.forEach((eventType) =>
              this._eventDictionary.addEventReference(eventType, name)
            );*/
  }

  addAll(narratives, priorities) {
    for (var name in narratives) {
      var fun = narratives[name];
      var prio = priorities[name];
      this.addNarrative(name, prio, fun);
    }
  }

  async request(e) {
    var name = "request " + e;
    var nar = async function* () {
      yield {
        request: [e],
        wait: [
          function (x) {
            return true;
          },
        ],
      };
    };
    // XXX should be lowest priority (1 is highest)
    await this.addNarrative(name, 1, nar);
    await this.run(); // Initiate super-step
  }

  async run(onUpdate) {
    if (isEmpty(this._running)) {
      return; // TODO: Test end-case of empty current list
    }
    while (notEmpty(this._running)) {
      var bid = this._running.shift();
      var nar = bid.narrative;
      var next = await nar.next(this._lastEvent);
      if (!next.done) {
        var newbid = next.value; // Run an iteration of the async generator
        newbid.narrative = nar; // Bind the narrative to the bid for running later
        newbid.priority = bid.priority; // Keep copying the prio
        newbid.name = bid.name; // Keep copying the name
        newbid.stepIndex = bid.stepIndex++; // Update the current step of the narrative
        this._pending.push(newbid);
      } else {
        // This is normal - the narrative has finished.
      }
    }
    // End of current part
    this.selectNextEvent();
    if (this._lastEvent) {
      // There is an actual last event selected
      var temp = [];
      while (notEmpty(this._pending)) {
        bid = this._pending.shift();
        var r = bid.request ? bid.request : [];
        // Always convert `request: 'FOO'` into `request: ['FOO']`
        if (!Array.isArray(r)) {
          r = [r];
        }
        var w = bid.wait ? bid.wait : [];
        if (!Array.isArray(w)) {
          w = [w];
        }
        var waitlist = r.concat(w);
        var cur = false;
        for (var i = 0; i < waitlist.length; i++) {
          var waiting = waitlist[i];
          // Convert string `request|wait: 'FOO'` into `request|wait: { type: 'FOO'}`
          if (typeof waiting === "string") {
            waiting = { type: waiting };
          }
          if (
            waiting.type === this._lastEvent.type ||
            (typeof waiting === "function" && waiting(this._lastEvent))
          ) {
            cur = true;
          }
        }
        if (cur && bid.narrative) {
          //bid.stepIndex++; // Increment the step index /////////////////////////////////////////////////////////////////////////////
          this._running.push(bid);
        } else {
          temp.push(bid);
        }
      }
      this._pending = temp;
      await this.run(onUpdate); // Pass the onUpdate callback to the next call
    } else {
      // Nothing was selected - end of super-step
      this._lastEvent = undefined; // Gotcha: null is not the same as undefined

      if (typeof onUpdate === "function") {
        onUpdate(this); // Invoke the onUpdate callback after the game runs a step
      }
    }
  }

  selectNextEvent() {
    var i, j, k;
    var candidates = [];
    var events = [];
    for (i = 0; i < this._pending.length; i++) {
      var bid = this._pending[i];
      if (bid.request) {
        // Always convert `request: 'FOO'` into `request: ['FOO']`
        if (!Array.isArray(bid.request)) {
          bid.request = [bid.request];
        }
        for (j = 0; j < bid.request.length; j++) {
          var e = bid.request[j];
          // Convert string `request: 'FOO'` into `request: { type: 'FOO'}`
          if (typeof e === "string") {
            e = { type: e };
          }
          var c = {
            priority: bid.priority,
            event: e,
          };
          candidates.push(c);
        }
      }
    }
    for (i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      var ok = true;
      for (j = 0; j < this._pending.length; j++) {
        bid = this._pending[j];
        if (bid.block) {
          // Always convert `block: 'FOO'` into `block: ['FOO']`
          if (!Array.isArray(bid.block)) {
            bid.block = [bid.block];
          }
          for (k = 0; k < bid.block.length; k++) {
            var blocked = bid.block[k];
            e = candidate.event;

            // Convert string `block: 'FOO'` into `block: { type: 'FOO'}`
            if (typeof blocked === "string") {
              blocked = { type: blocked };
            }

            if (
              e.type === blocked.type ||
              (typeof blocked === "function" && blocked(e))
            ) {
              ok = false;
            }
          }
        }
      }
      if (ok) {
        events.push(candidate);
      }
    }
    if (events.length > 0) {
      events.sort(compareBids);
      this._lastEvent = events[0].event;
      this._lastEvent.priority = events[0].priority;
      this._story.push(this._lastEvent);
    } else {
      this._lastEvent = null;
    }
  }
  modifyPriority(name, newPriority) {
    const foundBid =
      this._running.find((bid) => bid.name === name) ||
      this._pending.find((bid) => bid.name === name);
    if (foundBid) {
      foundBid.priority = newPriority;
    }
  }

  disableNarrative(name) {
    const index = this._running.findIndex((bid) => bid.name === name);
    if (index !== -1) {
      const bid = this._running[index];
      this._disabled.push(bid);
      this._running.splice(index, 1);
    }
  }

  enableNarrative(name) {
    const index = this._disabled.findIndex((bid) => bid.name === name);
    if (index !== -1) {
      const bid = this._disabled[index];
      this._running.push(bid);
      this._disabled.splice(index, 1);
    }
  }

  removeNarrative(name) {
    const removeFromList = (list) => {
      const index = list.findIndex((bid) => bid.name === name);
      if (index !== -1) {
        list.splice(index, 1);
        return true;
      }
      return false;
    };

    if (!removeFromList(this._running)) {
      if (!removeFromList(this._pending)) {
        removeFromList(this._disabled);
      }
    }
  }

  // It would be useful to have an extractEventTypesFromNarrative(narrative)
}

export default Game;
