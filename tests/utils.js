const initialDucks = [
  { name: 'Daffy', trait: 'black' },
  { name: 'The Ugly Duckling', color: 'yellow' }, // actually a swan...
];

function duckReducer(prevDucks=initialDucks, action) {
  switch(action.type) {
    case 'ADD_DUCK':
      return [...prevDucks, action.duck];
    default:
      return prevDucks;
  }
}

function newDuckReducer(prevDucks=initialDucks, action) {
  switch(action.type) {
    case 'ENHANCE_DUCK':
      const duck = prevDucks.filter(duck => duck.name === action.name)[0];
      if (!duck) throw new Error(`Duck ${action.name} does not exist!`);

      const enhancedDuck = Object.assign({}, duck);
      if (!enhancedDuck.enhancements) enhancedDuck.enhancements = [];
      enhancedDuck.enhancements.push(action.enhancement);

      const nextDucks = [...prevDucks];
      nextDucks.splice(nextDucks.indexOf(duck), 1);
      nextDucks.push(enhancedDuck);
      return nextDucks;
    default:
      return prevDucks;
  }
}

module.exports = {
  initialDucks,
  duckReducer,
  newDuckReducer,
};
