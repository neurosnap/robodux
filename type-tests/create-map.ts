import createMap from '../src/create-map';

// testing no params
const one = createMap({ name: 'SLICE' });
// $ExpectType { add: (payload?: any) => Action<any, string>; set: (payload?: any) => Action<any, string>; remove: (payload: string[]) => Action<string[], string>; patch: (payload: PatchEntity<AnyState>) => Action<...>; reset: () => Action<...>; }
one.actions;
// $ExpectType Reducer<AnyState, Action<any, string>>
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

const two = createMap<SliceState>({ name: 'slice' });
// $ExpectType { add: (payload: SliceState) => Action<SliceState, string>; set: (payload: SliceState) => Action<SliceState, string>; remove: (payload: string[]) => Action<string[], string>; patch: (payload: PatchEntity<...>) => Action<...>; reset: () => Action<...>; }
two.actions;
// $ExpectType Reducer<SliceState, Action<any, string>>
two.reducer;
// $ExpectType string
two.name;
