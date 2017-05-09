/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

                            - COMPOSE -

  Compose is a convenient utility function that is provided by redux.

  It takes in a list of single-argument functions, and composes them
  from right to left, passing in the return value of one into the next
  function to the left. Only the rightmost function may take multiple
  arguments. The return value is a function.

  e.g. compose(func1, func2, func3)(1, 2, 3) is equivalent to
       func1(func2(func3(1, 2, 3)))

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function compose(...funcs) {
  if (funcs.length === 0) return (a) => a;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce((acc, cur) => (...args) => acc(cur(...args)));
}

module.exports = compose;
