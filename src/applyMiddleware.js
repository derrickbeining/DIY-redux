/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                          - MIDDLEWARE -

  applyMiddleware returns a store enhancer that applies middlewares
  to the store's dispatch method. As a refresher, an enhancer is a
  function that takes the createStore method and modifies it. The
  modified createStore should take the same function signature as the
  original, and similarly return a store object with the appropriate
  APIs (getState, dispatch, subscribe, and replaceReducer).
  
  applyMiddleware takes in many middlewares, so we will need to use 
  the compose function to combine all the middlewares and apply it
  to the dispatch all at once.

  For an example of redux middleware, take a look at redux-thunk:
    https://github.com/gaearon/redux-thunk/blob/master/src/index.js

  Middleware takes in an object with references to a store's dispatch
  and getState methods. This function returns _another function_ that
  receives dispatch, and returns a modified dispatch (much like the
  enhancer takes in createStore and returns an enhanced createStore).

  With three levels of functions being returned, I don't blame you if
  you're super confused by this 3-level-deep higher order function...
  Take some time to study the thunk middleware source code until you
  feel comfortable enough to move on.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const compose = require('./compose');

function applyMiddleware(...middlewares) {
  return (createStore) => {
    return (reducer, preloadedState, enhancer) => {
      const store = createStore(reducer, preloadedState, enhancer);

      const middlewareAPI = {
        getState: store.getState,
        dispatch: store.dispatch,
      };

      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      const enhancedDispatch = compose(...chain)(store.dispatch);
      store.dispatch = enhancedDispatch;

      return store;
    }
  }
}

module.exports = applyMiddleware;
