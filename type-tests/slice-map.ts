import mapSlice from '../src/slice-map';

// testing no params
const one = mapSlice({ slice: 'SLICE' });
// $ExpectType { [x: string]: (payload?: any) => Action<any>; }
one.actions;
// $ExpectType Reducer<AnyState, Action<any>>
one.reducer;
// $ExpectType "SLICE"
one.slice;

// testing with params
interface Obj {
  something: boolean;
}
interface SliceState {
  [key: string]: Obj;
}
interface Actions {
  add: SliceState;
  set: SliceState;
  remove: string[];
  reset: never;
}
interface State {
  slice: SliceState;
}
const two = mapSlice<SliceState, Actions, State>({ slice: 'slice' });
// $ExpectType { add: (payload: SliceState) => Action<SliceState>; set: (payload: SliceState) => Action<SliceState>; remove: (payload: string[]) => Action<string[]>; reset: () => Action<any>; }
two.actions;
// $ExpectType Reducer<SliceState, Action<any>>
two.reducer;
// $ExpectType "slice"
two.slice;
