import createSlice from '../src/slice';

// testing InputWithSlice and 3 params
const name = 'something';
interface ThreeState {
  something: number;
}
const addThree = createSlice<number, { add: number }, ThreeState>({
  name,
  reducts: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addThree.actions;
// $ExpectType Reducer<number, Action<any>>
addThree.reducer;
// $ExpectType "something"
addThree.name;

// testing InputWithSlice and 2 params
const addFour = createSlice<number, { add: number }>({
  name: 'something',
  reducts: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addFour.actions;
// $ExpectType Reducer<number, Action<any>>
addFour.reducer;
// $ExpectType string | number | symbol
addFour.name;

// testing InputWithSlice and no params
const addFive = createSlice({
  name: 'something',
  reducts: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addFive.actions;
// $ExpectType Reducer<number, Action<any>>
addFive.reducer;
// $ExpectType "something"
addFive.name;

// testing InputWithSlice initialized let
let eightSlice = 'something';
const addEight = createSlice({
  name: eightSlice,
  reducts: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addEight.actions;
// $ExpectType Reducer<number, Action<any>>
addEight.reducer;
// $ExpectType string | number
addEight.name;
