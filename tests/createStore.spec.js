const expect = require('chai').expect;
const sinon = require('sinon');

const createStore = require('../src/createStore');
const { initialDucks, duckReducer } = require('./utils');

describe('createStore', () => {
  let duckStore, duckReducerSpy;

  beforeEach(() => {
    duckReducerSpy = sinon.spy(duckReducer);
    duckStore = createStore(duckReducerSpy, []); // preloaded state is an empty array
  });

  it('is a function', () => {
    expect(createStore).to.be.a('function');
  });

  xit('expects the first argument (the reducer) to be a function or throws TypeError', () => {
    expect(createStore.bind(null, 'not a func')).to.throw(TypeError);
  });

  describe('return value (the Store)', () => {
    xit('is an object', () => {
      expect(duckStore).to.be.an('object');
    });

    xit('should *only* have getState, dispatch, subscribe, and replaceReducer properties', () => {
      const duckStoreMethods = Object.keys(duckStore);
      expect(duckStoreMethods).has.lengthOf(4);
      expect(duckStoreMethods.getState).is.a('function');
      expect(duckStoreMethods.dispatch).is.a('function');
      expect(duckStoreMethods.subscribe).is.a('function');
      expect(duckStoreMethods.replaceReducer).is.a('function');
    });
  });

  describe('state', () => {
    xit('is defined by running the reducer with preloadedState and an init action', () => {
      expect(duckReducerSpy.called).to.be.true;

      const [ state, action ] = duckReducerSpy.lastCall.args;
      expect(state).to.deep.equal([]); // see line 12
      expect(action).to.deep.equal({ type: 'INIT' });
    });

    xit('can only be accessed using the getState method', () => {
      expect(duckStore.state).to.be.undefined;
      expect(duckStore.getState()).to.deep.equal(initialDucks);
    });
  });

  describe('updating state', () => {
    const addRubberDucky = {
      type: 'ADD_DUCk',
      duck: { name: 'The Rubber Duck', color: 'yellow' },
    };

    describe('setting up dispatch', () => {
      xit('expects a plain action object', () => {
        const invalidAction = 'not an object';
        expect(duckStore.dispatch.bind(null, invalidAction)).to.throw(Error);
      });

      xit('expects action object to have a "type" property', () => {
        const invalidAction = { notType: 'BAD!' };
        expect(duckStore.dispatch.bind(null, invalidAction)).to.throw(Error);
      });

      xit('returns the action object', () => {
        expect(duckStore.dispatch(addRubberDucky)).to.deep.equal(addRubberDucky);
      });

      xit('runs the reducer with state and action', () => {
        const expectedStateCalled = store.getState();

        duckStore.dispatch(addRubberDucky);
        expect(duckReducerSpy.calledOnce).to.be.true;

        const [ state, action ]  = duckReducerSpy.lastCall.arg;
        expect(state).to.deep.equal(expectedStateCalled);
        expect(action).to.deep.equal(addRubberDucky);
      });
    });

    describe('setting up subscribe', () => {
      xit('expects a function (a subscription/listener) or throws TypeError', () => {
        expect(duckStore.subscribe.bind(null, 'not a func')).to.throw(TypeError);
      });

      xit('returns a function that unsubscribes a listener', () => {
        expect(duckStore.subscribe(()=>{})).to.be.a('function');
      });
    });

    describe('integrating dispatch and subscribe', () => {
      xit('calling dispatch invokes all subscribed listeners', () => {
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

      xit('unsubscribe removes only the correct listener', () => {
        const listenerA = sinon.spy();
        const listenerB = sinon.spy();        

        const unsubscribeA = duckStore.subscribe(listenerA);
        const unsubscribeB1 = duckStore.subscribe(listenerB);        
        const unsubscribeB2 = duckStore.subscribe(listenerB); // subscribing B twice!

        unsubscribeA();
        unsubscribeB1(); // remove one of two listenerB subscriptions

        duckStore.dispatch(addRubberDucky);

        expect(listenerA.called).to.be.false; // A was unsubscribed
        expect(listenerB.calledOnce).to.be.true; // one B subscription should be removed, other one untouched
      });

      xit('unsubcribe will not remove more listeners if called multiple times', () => {
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

  });
});
