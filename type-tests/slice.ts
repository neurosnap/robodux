import createSlice from '../src/slice';

// $ExpectError Property 'actions' is missing in type '{ initialState: number; }' but required in type 'InputWithoutSlice<number, {}>'.
createSlice({ initialState: 0 });

// $ExpectError Property 'initialState' is missing in type '{ actions: {}; }' but required in type 'InputWithoutSlice<{}, {}>'.
createSlice({ actions: {} });

createSlice({ actions: {}, initialState: 0 });

// $ExpectError Object is of type 'unknown'.
createSlice({ actions: { add: (state, p) => state + p }, initialState: 0 });

// testing InputWithoutSlice and 2 params
const addOne = createSlice<number, { add: number }>({
  actions: { add: (state, p) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addOne.actions;
// $ExpectType Reducer<number, Action<any>>
addOne.reducer;
// $ExpectType ""
addOne.slice;

// testing InputWithoutSlice and no params
const addTwo = createSlice({
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addTwo.actions;
// $ExpectType Reducer<number, Action<any>>
addTwo.reducer;
// $ExpectType ""
addTwo.slice;

// testing InputWithSlice and 3 params
const slice = 'something';
interface ThreeState {
  something: number;
}
const addThree = createSlice<number, { add: number }, ThreeState>({
  slice,
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addThree.actions;
// $ExpectType Reducer<number, Action<any>>
addThree.reducer;
// $ExpectType "something"
addThree.slice;

// testing InputWithSlice and 2 params
const addFour = createSlice<number, { add: number }>({
  slice: 'something',
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addFour.actions;
// $ExpectType Reducer<number, Action<any>>
addFour.reducer;
// $ExpectType string | number | symbol
addFour.slice;

// testing InputWithSlice and no params
const addFive = createSlice({
  slice: 'something',
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addFive.actions;
// $ExpectType Reducer<number, Action<any>>
addFive.reducer;
// $ExpectType "something"
addFive.slice;

// testing InputWithBlankSlice and 2 params
const addSix = createSlice<number, { add: number }>({
  slice: '',
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addSix.actions;
// $ExpectType Reducer<number, Action<any>>
addSix.reducer;
// $ExpectType ""
addSix.slice;

// testing InputWithBlankSlice and no params
const addSeven = createSlice({
  slice: '',
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addSeven.actions;
// $ExpectType Reducer<number, Action<any>>
addSeven.reducer;
// $ExpectType ""
addSeven.slice;

// testing InputWithSlice initialized let
let eightSlice = 'something';
const addEight = createSlice({
  slice: eightSlice,
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addEight.actions;
// $ExpectType Reducer<number, Action<any>>
addEight.reducer;
// $ExpectType string | number
addEight.slice;
