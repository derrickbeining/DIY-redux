/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                          - MIDDLEWARE -

  applyMiddleware is a store enhancer that applies middleware to the
  store's dispatch method.
  
  For an example of a piece of redux middleware, study the redux-thunk
  source code and try to decipher what's going on:
    https://github.com/gaearon/redux-thunk/blob/master/src/index.js

  Middleware takes in an object with references to a store's dispatch
  and getState methods. This function returns another function that
  receives dispatch, and returns a modified dispatch (much like the
  enhancer takes in createStore and returns an enhanced createStore).

  applyMiddleware takes in many middlewares, so we will need to use 
  the compose function to combine all the middlewares and apply them
  to the dispatch all together.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function applyMiddleware(...middlewares) {
  
}

module.exports = applyMiddleware;
