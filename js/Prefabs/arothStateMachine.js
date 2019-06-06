// Adam Roth
// Modified from David Hayes: https://github.com/drhayes/impactjs-statemachine
// Other annotations and modifications by Nathan Altice 5/16/19

var StateMachine = function(entity, opts) {
  this.unnamedTransitionCounter = 0;  // tracks unnamed transitions w/ a generic counter

  this.entity = entity;               // the entity that called the state machine
  this.opts = opts || {};             // tracks options (e.g., debug)

  this.states = {};
  this.transitions = {};
  
  // track states by name
  this.initialState = null;
  this.currentState = null;
  this.previousState = null;
  this.timer = null;
  
  // state creation method
  this.state = function(name, definition) {
    if (!definition) {
      return this.states[name];
    }
    this.states[name] = definition;
    if (!this.initialState) {
      this.initialState = name;
    }
  };

  // transition creation method
  this.transition = function(name, fromState, toState, predicate) {
    // return if no parameters passed
    if (!fromState && !toState && !predicate) {
      throw new Error('Transition missing required parameters');
      return this.transitions[name];
    }
    // if a transition name isn't provided, reassign parameters and give transition generic counter name
    if (!predicate) {
      predicate = toState;
      toState = fromState;
      fromState = name;
      name = 'transition-' + this.unnamedTransitionCounter;
      this.unnamedTransitionCounter += 1;
    }
    // throw error if fromState in transition call doesn't match a state in the FSM
    if (!this.states[fromState]) {
      throw new Error('Missing from state: ' + fromState);
    }
    // throw error if toState in transition call doesn't match a state in the FSM
    if (!this.states[toState]) {
      throw new Error('Missing to state: ' + toState);
    }
    // build transition object
    var transition = {
      name: name,
      fromState: fromState,
      toState: toState,
      predicate: predicate
    };
    // add to transitions list
    this.transitions[name] = transition;
    // return the transition object
    return transition;
  };

  // update state machine
  this.update = function() {
    if (!this.currentState) {
      this.currentState = this.initialState;
    }
    var state = this.state(this.currentState);

    if (this.previousState !== this.currentState) {
      if( this.lastTransition ){
        this.entity.animations.play(this.lastTransition.name);
        if( this.opts.debug ){
          console.log("Play transitional animation: " + this.lastTransition.name);
        }
      }
      if (state.enter) {
        if(this.opts.debug) {
          console.log("%cEnter state " + this.currentState, "color: green; font-size: 14px");
        }
        // set timer to current time using JS Date object
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        this.timer = new Date();
        state.enter(this.lastTransition);
      }
      this.previousState = this.currentState;
    }
    
    // verify the transitional animation has completed before entering update()
    if(this.lastTransition && (this.entity.animations.currentAnim.name == this.lastTransition.name && this.entity.animations.currentAnim.isPlaying)){
      return;
    }

    if(this.entity.animations.currentAnim.name != this.currentState){
      if(this.opts.debug ){
        console.log("Play animation: " + this.currentState);
      }
      this.entity.animations.play(this.currentState);
    }
    
    if (state.update) {
      state.update();
    }
    // iterate through transitions
    for (var name in this.transitions) {
      var transition = this.transitions[name];
      if (transition.fromState === this.currentState && transition.predicate()) {
        this.lastTransition = transition;
        if (state.exit) {
          state.exit();
        }
        this.currentState = transition.toState;
        return;
      }
    }
  };
};