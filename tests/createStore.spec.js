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
      expect(state).to.deep.equal(undefined); // see line 12, no preloadedState is provided
      expect(action).to.deep.equal({ type: 'INIT' });
    });

    it('can only be accessed using the getState method', () => {
      // HINT: closure!
      expect(duckStore.state).to.be.undefined;
      expect(duckStore.getState()).to.deep.equal(initialDucks);
    });
  });

  describe('updating state', () => {
    const addRubberDucky = {
      type: 'ADD_DUCK',
      duck: { name: 'The Rubber Duck', color: 'yellow' },
    };

    describe('setting up dispatch', () => {
      it('expects a plain action object', () => {
        const invalidAction = 'not an object';
        expect(duckStore.dispatch.bind(null, invalidAction)).to.throw(TypeError);
      });

      it('expects action object to have a "type" property', () => {
        const invalidAction = { notType: 'BAD!' };
        expect(duckStore.dispatch.bind(null, invalidAction)).to.throw(Error);
      });

      it('returns the action object', () => {
        expect(duckStore.dispatch(addRubberDucky)).to.deep.equal(addRubberDucky);
      });

      it('runs the reducer with state and action', () => {
        const expectedStateCalled = duckStore.getState();

        duckStore.dispatch(addRubberDucky);
        
        const [ state, action ]  = duckReducerSpy.lastCall.args;
        expect(state).to.deep.equal(expectedStateCalled);
        expect(action).to.deep.equal(addRubberDucky);
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
      it('calling dispatch invokes all subscribed listeners', () => {
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
    it('expects a function (the next reducer)', () => {
      expect(duckStore.replaceReducer.bind(null, 'not a func')).to.throw(TypeError);
    });

    it('does not reset state when reducer is replaced', () => {
      const actualAdviceMallard = {
        name: 'Actual Advice Mallard',
        color: 'multi',
      };

      expect(duckStore.getState()).to.deep.equal(initialDucks);
      duckStore.dispatch({
        type: 'ADD_DUCK',
        duck: actualAdviceMallard,
      });

      expect(duckStore.getState()).to.deep.equal([...initialDucks, actualAdviceMallard]);
      const newDuckReducerSpy = sinon.spy(newDuckReducer);
    });
  });

  describe('enhancer', () => {

  });
});
