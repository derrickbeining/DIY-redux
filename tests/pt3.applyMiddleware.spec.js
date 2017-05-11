const expect = require('chai').expect;
const sinon = require('sinon');

// we're using require, but these libraries use ES6 export default, hence the .default
const logger = require('redux-logger').default;
const thunk = require('redux-thunk').default;

const applyMiddleware = require('../src/applyMiddleware');
const createStore = require('../src/createStore');
const { initialDucks, duckReducer } = require('./utils');

describe('applyMiddleware', () => {
  xit('returns a function (an enhancer)', () => {
    expect(applyMiddleware(thunk)).to.be.a('function');
  });

  xit('enhancer is defined with one parameter (createStore)', () => {
    expect(applyMiddleware(thunk)).to.have.lengthOf(1);
  });

  xit('enhancer returns another function (the enhanced createStore)', () => {
    const enhancedCreateStore = applyMiddleware(thunk)(createStore);
    expect(enhancedCreateStore).to.be.a('function');
  });

  xit('enhanced createStore has the same function signature as createStore', () => {
    const enhancedCreateStore = applyMiddleware(thunk)(createStore);
    expect(enhancedCreateStore).to.have.lengthOf(3); // reducer, preloadedState, and enhancer
  });

  xit('enhanced createStore creates a store using the original createStore and returns it', () => {
    const createStoreSpy = sinon.spy(createStore);
    const enhancedCreateStore = applyMiddleware(thunk)(createStoreSpy);
    const enhancedStore = enhancedCreateStore(duckReducer);
  

    expect(createStoreSpy.called).to.be.true;
    expect(createStoreSpy.lastCall.args).to.contain(duckReducer);
    expect(enhancedStore).to.be.an('object');
    expect(Object.keys(enhancedStore)).to.have.lengthOf(4);
  });

  /*
  
    At this point, we have pretty good scaffolding for applyMiddleware, 
    but we're not doing anything with the middlewares passed in! We need
    to somehow modify the dispatch method using the middlewares and make
    sure the enhanced store we return has a cool new dispatcher.
    
  */

  xit('passes an object with getState and dispatch to all middleware passed in', () => {
    const thunkSpy = sinon.spy(thunk);
    const loggerSpy = sinon.spy(logger);
    const enhancedCreateStore = applyMiddleware(thunkSpy, loggerSpy)(createStore);
    const enhancedStore = enhancedCreateStore(duckReducer);

    const thunkArgs = thunkSpy.lastCall.args[0];
    expect(thunkArgs).to.be.an('object');
    expect(thunkArgs.getState).to.be.a('function');
    expect(thunkArgs.dispatch).to.be.a('function');

    const loggerArgs = loggerSpy.lastCall.args[0];
    expect(loggerArgs).to.be.an('object');
    expect(loggerArgs.getState).to.be.a('function');
    expect(loggerArgs.dispatch).to.be.a('function');
  });

  /*

    By passing the last spec, you've created a chain of functions that are
    ready to receive the dispatch method and modify it (let's call them
    "dispatch-modifiers"). However, we want to modify dispatch in one
    fell swoop, so let's first compose a single dispatch-modifier that only
    needs to be invoked once, and returns the nice updated dispatch we wanted!
    Good thing we wrote that compose function!

    I'll let you try to connect the final dots, but essentially you must
    successfully modify the dispatch method and return a store with the
    modified dispatch.

                                  ------

    Here is the final test! Will your applyMiddleware function work with 
    third-party middlewares like redux thunk?! Ahhhh, this is so exciting!

  */

  xit('works with thunk middleware', () => {
    const storeWithMiddleware = createStore(duckReducer, applyMiddleware(thunk));

    expect(storeWithMiddleware.getState()).to.equal(initialDucks);

    const theUglyDuckling = {
      name: 'The Ugly Duckling',
      color: 'yellow'
    }; // actually a swan...
    
    storeWithMiddleware.dispatch({
      type: 'ADD_DUCK',
      duck: theUglyDuckling,
    });

    let expectedDucks = [...initialDucks, theUglyDuckling];
    expect(storeWithMiddleware.getState()).to.deep.equal([...initialDucks, theUglyDuckling]);

    const duck1 = { name: 'duck1', color: 'yellow' };
    const duck2 = { name: 'duck2', color: 'white' };
    const duck3 = { name: 'duck3', color: 'grey' };

    const addManyDucks = (dispatch, getState) => {
      dispatch({ type: 'ADD_DUCK', duck: duck1 });
      dispatch({ type: 'ADD_DUCK', duck: duck2 });
      dispatch({ type: 'ADD_DUCK', duck: duck3 });
    };

    storeWithMiddleware.dispatch(addManyDucks);

    expectedDucks = [...expectedDucks, duck1, duck2, duck3];
    expect(storeWithMiddleware.getState()).to.deep.equal(expectedDucks);
  });
});
