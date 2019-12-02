import assignSlice from '../src/slice-assign';

// testing no params
const one = assignSlice({ name: 'SLICE', initialState: false });
// $ExpectType { set: (payload: boolean) => Action<boolean, string>; reset: () => Action<any, string>; }
one.actions;
// $ExpectType Reducer<boolean, Action<any, string>>
one.reducer;
// $ExpectType string
one.name;

// testing with params
type SliceState = boolean;
const two = assignSlice<SliceState>({
  name: 'slice',
  initialState: false,
});
// $ExpectType { set: (payload: boolean) => Action<boolean, string>; reset: () => Action<any, string>; }
two.actions;
// $ExpectType Reducer<boolean, Action<any, string>>
two.reducer;
// $ExpectType string
two.name;
