import assignSlice from '../src/slice-assign';

// testing no params
const one = assignSlice({ name: 'SLICE', initialState: false });
// $ExpectType { set: (payload: boolean) => Action<boolean>; reset: () => Action<any>; }
one.actions;
// $ExpectType Reducer<boolean, Action<any>>
one.reducer;
// $ExpectType string
one.name;

// testing with params
type SliceState = boolean;
const two = assignSlice<SliceState>({
  name: 'slice',
  initialState: false,
});
// $ExpectType { set: (payload: boolean) => Action<boolean>; reset: () => Action<any>; }
two.actions;
// $ExpectType Reducer<boolean, Action<any>>
two.reducer;
// $ExpectType string
two.name;
