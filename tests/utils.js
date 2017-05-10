const initialDucks = [
  { name: 'Daffy', trait: 'black' },
  { name: 'Statey', color: 'mystery' }, // curtesy of Nick Drane
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
    case 'REMOVE_DUCK':
      const nextDucks = prevDucks.filter(duck => duck.name !== action.name);
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
