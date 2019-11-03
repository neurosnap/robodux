import mapSlice from '../src/slice-map';

// testing no params
const one = mapSlice({ name: 'SLICE' });
// $ExpectType { add: (payload?: any) => Action<any>; set: (payload?: any) => Action<any>; remove: (payload: string[]) => Action<string[]>; patch: (payload: PatchEntity<AnyState>) => Action<PatchEntity<AnyState>>; reset: () => Action<...>; }
one.actions;
// $ExpectType Reducer<AnyState, Action<any>>
one.reducer;
// $ExpectType string
one.name;

// testing with params
interface Obj {
  something: boolean;
}
interface SliceState {
  [key: string]: Obj;
}

const two = mapSlice<SliceState>({ name: 'slice' });
// $ExpectType { add: (payload: SliceState) => Action<SliceState>; set: (payload: SliceState) => Action<SliceState>; remove: (payload: string[]) => Action<string[]>; patch: (payload: PatchEntity<SliceState>) => Action<...>; reset: () => Action<...>; }
two.actions;
// $ExpectType Reducer<SliceState, Action<any>>
two.reducer;
// $ExpectType string
two.name;
