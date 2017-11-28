const expect = require('chai').expect;

const compose = require('../src/compose');

describe('compose', () => {
  const add = (...args) => args.reduce((acc, cur) => acc + cur, 0);
  const double = (x) => x * 2;
  const square = (x) => x * x;

  it('composes functions from right to left', () => {
    const composedFunc = compose(square, double, add);
    expect(composedFunc(1, 2, 3)).to.equal(144);
  });

  it('returns the first function if only one is provided', () => {
    expect(compose(add)).to.equal(add);
  });

  it('returns the first given argument if no functions are provided', () => {
    expect(compose()(1)).to.equal(1);
    expect(compose()(2, 3)).to.equal(2);
    expect(compose()()).to.equal(undefined);
  });

  it('will error out if one of the arguments passed in is not a function', () => {
    // this should already pass if you've implemented correctly up to this point
    expect(compose(square, double, 'not a func').bind(null, 1, 2, 3)).to.throw(Error);
    expect(compose(square, 'not a func', add).bind(null, 1, 2, 3)).to.throw(Error);
  });
});

              /* --> continue to applyMiddleware.spec.js --> */
