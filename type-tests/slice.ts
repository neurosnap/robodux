import createSlice from '../src/create-slice';

// testing InputWithName and 2 params
const addFour = createSlice<number, { add: number }>({
  name: 'something',
  reducers: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number, string>; }
addFour.actions;
// $ExpectType Reducer<number, Action<any, string>>
addFour.reducer;
// $ExpectType string
addFour.name;

// testing InputWithName and no params
const addFive = createSlice({
  name: 'something' as const,
  reducers: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number, string>; }
addFive.actions;
// $ExpectType Reducer<number, Action<any, string>>
addFive.reducer;
// $ExpectType string
addFive.name;

// testing InputWithName initialized let
let eightSlice = 'something';
const addEight = createSlice({
  name: eightSlice,
  reducers: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number, string>; }
addEight.actions;
// $ExpectType Reducer<number, Action<any, string>>
addEight.reducer;
// $ExpectType string
addEight.name;
