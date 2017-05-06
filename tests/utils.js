const initialDucks = [
  { name: 'Daffy', trait: 'black' },
  { name: 'The Ugly Duckling', color: 'yellow' }, // actually a swan...
];

function duckReducer(prevState=initialDucks, action) {
  switch(action.type) {
    case 'ADD_DUCK':
      return [...prevState, action.duck];
    default:
      return prevState;
  }
}

module.exports = {
  initialDucks,
  duckReducer,
};
