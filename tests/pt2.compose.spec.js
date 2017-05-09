const expect = require('chai').expect;
const sinon = require('sinon');

const compose = require('../src/compose');

describe('compose', () => {
  it('composes functions from right to left', () => {
    const add = (...args) => args.reduce((acc, cur) => acc + cur, 0);
    const double = (x) => x * 2;
    const square = (x) => x * x;
    
    const composedFunc = compose(square, double, add);
    expect(composedFunc(1, 2, 3)).to.equal(144);
  });

  it('returns the first given argument if no functions are provided');

  it('returns the first function if only one is provided');
});