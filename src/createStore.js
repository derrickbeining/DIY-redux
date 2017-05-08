/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                 - REFRESHER ON REDUX MECHANICS -

  The primary API of redux is the 'createStore' method.

  The createStore function should return an object (the store).
  A store is a state-management mechanism that emits events when
  its state is updated.

  A store's state should _never_ be publically accessible or modifiable.
  It can only be accessed through the 'getState' method, and modified
  via the 'dispatch' method which takes an object known as an 'action'.
  These actions must have a 'type' property describing the action, and
  often carries some payload (usually used to update state). e.g. - 
    const sampleAction = {
      type: 'ADD_DUCK',
      duck: { name: 'Donald', color: 'white' }
    };

  The user must define a reducer function that specifies how the state
  should be updated when an action is dispatched. The reducer is then
  passed into createStore as the first argment. It takes the previous
  state, an action, and returns the next state. e.g. -
    const reducer = function(prevState=initialState, action) {
      // does things based on action, returns next state
    };

  The store can register 'subscriptions' via the 'subscribe' method.
  The subscribe method takes a function that must be run every time
  the state is updated. 'subscribe' returns a function (unsubscribe)
  which allows for a specific listener to be removed.
    const unsubscribe = store.subscribe(() => {
      console.log('State updated!');
    });

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function createStore(reducer, preloadedState, enhancer) {
  let state = reducer(preloadedState, {type: 'INIT'});
  let subscriptions = [];

  if (typeof preloadedState === 'function' && typeof enhancer === undefined) {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (enhancer) {
    if (typeof enhancer !== 'function') throw new TypeError('Enhancer must be a function');
    return enhancer(createStore)(reducer, preloadedState);
  }

  function getState() {
      return state;
    }

  function dispatch(action) {
    if (typeof action !== 'object') throw new TypeError('Action must be a pure object');
    if (!action.type) throw new Error('Action object must have "type" key');

    const nextState = reducer(state, action);
    if (state !== nextState) {
      subscriptions.forEach(subscription => subscription());
      state = nextState;
    }

    return action;
  }

  function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') throw new TypeError('Reducer must be a function');
      reducer = nextReducer;
    }

  function subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('Listener must be a function');
    subscriptions.push(listener);

    let subscribed = true;
    return () => {
      if (!subscribed) return;
      subscriptions.splice(subscriptions.indexOf(listener), 1);
      subscribed = false;
    };
  }

  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  }
}

module.exports = createStore;
