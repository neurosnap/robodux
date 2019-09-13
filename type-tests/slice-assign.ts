import assignSlice from '../src/slice-assign';

// testing no params
const one = assignSlice({ name: 'SLICE', initialState: false });
// $ExpectType { [x: string]: (payload?: any) => Action<any>; }
one.actions;
// $ExpectType Reducer<boolean, Action<any>>
one.reducer;
// $ExpectType "SLICE"
one.name;

// testing with params
type SliceState = boolean;
interface Actions {
  set: SliceState;
  reset: never;
}
interface State {
  slice: SliceState;
}
const two = assignSlice<SliceState, Actions, State>({
  name: 'slice',
  initialState: false,
});
// $ExpectType { set: (payload: boolean) => Action<boolean>; reset: () => Action<any>; }
two.actions;
// $ExpectType Reducer<boolean, Action<any>>
two.reducer;
// $ExpectType "slice"
two.name;
