import createSlice from '../src/slice';

// $ExpectError Property 'actions' is missing in type '{ initialState: number; }' but required in type 'InputWithoutSlice<number, {}>'.
createSlice({ initialState: 0 });

// $ExpectError Property 'initialState' is missing in type '{ actions: {}; }' but required in type 'InputWithoutSlice<{}, {}>'.
createSlice({ actions: {} });

createSlice({ actions: {}, initialState: 0 });

// $ExpectError Object is of type 'unknown'.
createSlice({ actions: { add: (state, p) => state + p }, initialState: 0 });

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
// $ExpectType { getSlice: (state: number) => number; }
addOne.selectors;

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
// $ExpectType { getSlice: (state: number) => number; }
addTwo.selectors;

const addThree = createSlice<number, { add: number }, any>({
  slice: 'something',
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addThree.actions;
// $ExpectType Reducer<number, Action<any>>
addThree.reducer;
// $ExpectType "something"
addThree.slice;
// $ExpectType { getSlice: (state: any) => number; }
addThree.selectors;

/*
const slice = 'something';
const addThree = createSlice({
  actions: { add: (state, p: number) => state + p },
  initialState: 0,
  slice,
});
// $ExpectType { add: (payload: number) => Action<number>; }
addThree.actions;
// $ExpectType Reducer<number, Action<any>>
addThree.reducer;
// $ExpectType "something"
addThree.slice;
// $ExpectType { getSlice: (state: number) => number; }
addThree.selectors;
*/
