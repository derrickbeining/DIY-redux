/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                          - REDUX STORE -

  The primary API of redux is the 'createStore' method.

  The createStore function should return an object (the store).
  A store is a state-management mechanism that emits events when
  its state is updated.

  A store's state should _never_ be publically accessible or modifiable.
  It can only be accessed through the 'getState' method, and modified
  via the 'dispatch' method which takes objects known as 'actions'.
  Actions must have a 'type' property describing the action, and
  often carry some payload to update the state.
    const sampleAction = {
      type: 'ADD_DUCK',
      duck: { name: 'Donald Duck', color: 'white' }
    };

  The user must define a reducer function that specifies how the state
  should be updated when an action is dispatched. The reducer is then
  passed into createStore as the first argment. It takes the previous
  state, an action, and returns the next state.
    const sampleReducer = function(prevState=initialState, action) {
      // does things based on action, returns next state
    };

  The store can register 'subscriptions' via the 'subscribe' method.
  The subscribe method in functions that must be run when the state
  is updated. 'subscribe' returns a function (unsubscribe), which allows
  for its corresponding listener to be removed.
    const unsubscribe = store.subscribe(() => {
      console.log('State updated!');
    });

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function isPlainObject(val) {
  return  typeof val === 'object'
          && !Array.isArray(val)
          && val !== null
}

function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== 'function') throw new TypeError(`${reducer} is not a function`);
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState);
  } else if (enhancer !== undefined) {
    throw new TypeError(`${enhancer} is not a function`);
  } else if (typeof preloadedState === 'function') {
    return preloadedState(createStore)(reducer);
  }
  let rootReducer = reducer;
  let state = rootReducer(preloadedState, {type: '@@init'});
  let subscribers = [];
  function updateState(nextState) {
    state = nextState;
    subscribers.forEach(fn => fn());
  }

  return {
    getState: function() {
      return state;
    },
    dispatch: function(action) {
      if (!isPlainObject(action)) throw new TypeError('plain objects only please');
      if (action.type === undefined) throw Error('action type cannot be undefined');
      const nextState = rootReducer(state, action);
      if (nextState !== state) updateState(nextState);
      return action;
    },
    subscribe: function(fn) {
      if (typeof fn !== 'function') throw new TypeError('subscribe takes a function');
      const uniqueFn = fn.bind(null)
      subscribers.push(uniqueFn);
      return function unsubscribe() {
        subscribers = subscribers.filter(theFn => !Object.is(theFn, uniqueFn));
      }
    },
    replaceReducer: function(newReducer) {
      if (typeof newReducer !== 'function') throw new TypeError('must take a function');
      rootReducer = newReducer;
    }
  };
}

module.exports = createStore;
