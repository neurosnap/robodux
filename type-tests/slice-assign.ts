import assignSlice from '../src/slice-assign';

// testing no params
const one = assignSlice({ slice: 'SLICE', initialState: false });
// $ExpectType { [x: string]: (payload?: any) => Action<any>; }
one.actions;
// $ExpectType Reducer<boolean, Action<any>>
one.reducer;
// $ExpectType "SLICE"
one.slice;
// $ExpectType { getSlice: (state: { SLICE: any; }) => boolean; }
one.selectors;

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
  slice: 'slice',
  initialState: false,
});
// $ExpectType { set: (payload: boolean) => Action<boolean>; reset: () => Action<any>; }
two.actions;
// $ExpectType Reducer<boolean, Action<any>>
two.reducer;
// $ExpectType "slice"
two.slice;
// $ExpectType { getSlice: (state: State) => boolean; }
two.selectors;
