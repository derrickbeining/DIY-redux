const expect = require('chai').expect;
const sinon = require('sinon');

const createStore = require('../src/createStore');
const { initialDucks, duckReducer, newDuckReducer } = require('./utils');

describe('createStore', () => {
  let duckStore, duckReducerSpy;

  beforeEach(() => {
    duckReducerSpy = sinon.spy(duckReducer);
    duckStore = createStore(duckReducerSpy);
  });

  it('is a function', () => {
    expect(createStore).to.be.a('function');
  });

  it('expects the first argument (the reducer) to be a function', () => {
    expect(createStore.bind(null, 'not a func')).to.throw(TypeError);
  });

  describe('return value (the Store)', () => {
    it('is an object', () => {
      expect(duckStore).to.be.an('object');
    });

    it('should *only* have getState, dispatch, subscribe, and replaceReducer properties', () => {
      const duckStoreMethods = Object.keys(duckStore);
      expect(duckStoreMethods).has.lengthOf(4);
      expect(duckStore.getState).to.be.a('function');
      expect(duckStore.dispatch).to.be.a('function');
      expect(duckStore.subscribe).to.be.a('function');
      expect(duckStore.replaceReducer).to.be.a('function');
    });
  });

  describe('state', () => {
    it('is defined by running the reducer with preloadedState and an init action', () => {
      expect(duckReducerSpy.called).to.be.true;

      const [ state, action ] = duckReducerSpy.lastCall.args;
      expect(state).to.be.undefined; // see line 12, no preloadedState is provided
      expect(action).to.deep.equal({ type: '@@init' });
    });

    it('can only be accessed using the getState method', () => {
      // HINT: closure!
      expect(duckStore.state).to.be.undefined;
      expect(duckStore.getState()).to.equal(initialDucks);
    });
  });

  describe('updating state', () => {
    const rubberDucky = { name: 'The Rubber Duck', color: 'yellow' };
    const addRubberDucky = {
      type: 'ADD_DUCK',
      duck: rubberDucky,
    };

    describe('setting up dispatch', () => {
      it('expects a plain action object', () => {
        const invalidAction = 'not an object';
        expect(duckStore.dispatch.bind(null, invalidAction)).to.throw(TypeError);
      });

      it('action object "type" property cannot be undefined', () => {
        const noTypeAction = { notType: 'BAD!' };
        const undefTypeAction = { type: undefined };

        expect(duckStore.dispatch.bind(null, noTypeAction)).to.throw(Error);
        expect(duckStore.dispatch.bind(null, undefTypeAction)).to.throw(Error);
      });

      it('action object "type" property can be falsy', () => {
        const nullTypeAction = { type: null };
        const falseTypeAction = { type: false };
        const emptyStrTypeAction = { type: '' };
        const NaNTypeAction = { type: NaN };

        expect(duckStore.dispatch.bind(null, nullTypeAction)).to.not.throw(Error);
        expect(duckStore.dispatch.bind(null, falseTypeAction)).to.not.throw(Error);
        expect(duckStore.dispatch.bind(null, emptyStrTypeAction)).to.not.throw(Error);
        expect(duckStore.dispatch.bind(null, NaNTypeAction)).to.not.throw(Error);
      });

      it('returns the action object', () => {
        expect(duckStore.dispatch(addRubberDucky)).to.equal(addRubberDucky);
      });

      it('runs the reducer with state and action', () => {
        duckStore.dispatch(addRubberDucky);

        const [ state, action ]  = duckReducerSpy.lastCall.args;
        expect(state).to.equal(initialDucks);
        expect(action).to.equal(addRubberDucky);
      });

      it('updates the state if running reducer returned a new object', () => {
        expect(duckStore.getState()).to.equal(initialDucks);
        duckStore.dispatch(addRubberDucky);
        expect(duckStore.getState()).to.deep.equal([...initialDucks, rubberDucky]);
      });

      it('does not update the state if reducer returned previous state', () => {
        const unknownAction = { type: 'UNKNOWN' };
        duckStore.dispatch(unknownAction);
        expect(duckStore.getState()).to.equal(initialDucks);
      });
    });

    describe('setting up subscribe', () => {
      it('expects a function (a subscription/listener)', () => {
        expect(duckStore.subscribe.bind(null, 'not a func')).to.throw(TypeError);
      });

      it('returns a function (unsubscribes a listener when invoked)', () => {
        expect(duckStore.subscribe(()=>{})).to.be.a('function');
      });
    });

    describe('integrating dispatch and subscribe', () => {
      it('updating state causes all subscribed listeners to fire', () => {
        const listenerA = sinon.spy();
        const listenerB = sinon.spy();

        duckStore.subscribe(listenerA);
        duckStore.subscribe(listenerB);

        expect(listenerA.called).to.be.false;
        expect(listenerB.called).to.be.false;

        duckStore.dispatch(addRubberDucky);

        expect(listenerA.called).to.be.true;
        expect(listenerB.called).to.be.true;
      });

      it('unsubscribe removes only the correct listener', () => {
        const listenerA = sinon.spy();
        const listenerB = sinon.spy();

        const unsubscribeA = duckStore.subscribe(listenerA);
        const unsubscribeB1 = duckStore.subscribe(listenerB);
        const unsubscribeB2 = duckStore.subscribe(listenerB); // subscribing B twice!

        unsubscribeA();
        unsubscribeB1(); // remove one of two listenerB subscriptions

        duckStore.dispatch(addRubberDucky);

        expect(listenerA.called).to.be.false; // A was unsubscribed
        expect(listenerB.calledOnce).to.be.true; // one B subscription is removed, other one untouched
      });

      it('unsubcribe will not remove more listeners if called multiple times', () => {
        // HINT: closure!!!
        const listenerA = sinon.spy();

        const unsubscribeA1 = duckStore.subscribe(listenerA);
        const unsubscribeA2 = duckStore.subscribe(listenerA);

        unsubscribeA2();
        unsubscribeA2();

        duckStore.dispatch(addRubberDucky);
        expect(listenerA.calledOnce).to.be.true;
      });
    });
  });

  describe('replaceReducer', () => {
    const actualAdviceMallard = {
      name: 'Actual Advice Mallard',
      color: 'multi',
    };

    const addMallard = () => ({
      type: 'ADD_DUCK',
      duck: actualAdviceMallard,
    });

    const removeMallard = () => ({
      type: 'REMOVE_DUCK',
      name: 'Actual Advice Mallard',
    });

    it('expects a function (the next reducer)', () => {
      expect(duckStore.replaceReducer.bind(null, 'not a func')).to.throw(TypeError);
    });

    it('replaces reducer', () => {
      duckStore.dispatch(addMallard());
      expect(duckStore.getState()).to.deep.equal([...initialDucks, actualAdviceMallard]);

      duckStore.replaceReducer(newDuckReducer);

      // only newDuckReducer has duck removing logic
      duckStore.dispatch(removeMallard());
      expect(duckStore.getState()).to.deep.equal(initialDucks);
    });

    it('does not reset state when reducer is replaced', () => {
      duckStore.dispatch(addMallard());
      expect(duckStore.getState()).to.deep.equal([...initialDucks, actualAdviceMallard]);

      duckStore.replaceReducer(newDuckReducer);
      expect(duckStore.getState()).to.deep.equal([...initialDucks, actualAdviceMallard]);
    });
  });


  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                              - EXTRA CREDIT -

      If you've reached this point without issue, you should have a fairly
      good understanding the redux essentials. The remainder is extra credit!
      If you implement the next sections correctly, you could use third-party
      libraries like redux-thunk or redux-logger with reducks. How cool! 🦆

  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  describe('enhancer', () => {

    // An enhancer is a function that takes createStore and returns an 'enhanced'
    // version of createStore. It has this signature:
      const exampleEnhancer = createStore => (reducer, preloadedState) => {
        // store enhancing logic here
      }

    // If a valid enhancer was supplied to createStore, we must return a store
    // that's been enhanced, e.g.
    //   const enhancedCreateStore = enhancer(createStore);
    //   return enhancedCreateStore(reducer, preloadedState);

    // The applyMiddleware function we'll be writing in an upcoming section is
    // an example of an enhancer.

    const enhancerSpy = sinon.spy(exampleEnhancer);
    afterEach(() => {
      enhancerSpy.reset();
    });

    it('is accepted as a third argument', () => {
      expect(createStore.bind(null, duckReducer, [], enhancerSpy)).to.not.throw();
      expect(enhancerSpy.called).to.be.true;
    });

    it('is accepted as a second argument if no preloaded state is provided', () => {
      expect(createStore.bind(null, duckReducer, enhancerSpy)).to.not.throw();
      expect(enhancerSpy.called).to.be.true;
    });

    it('must be a function if supplied', () => {
      expect(createStore.bind(null, duckReducer, [], 'not a func')).to.throw(TypeError);
    });
  });
});

                /* --> continue to compose.spec.js --> */
