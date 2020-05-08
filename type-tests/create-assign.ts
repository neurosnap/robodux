import createAssign from '../src/create-assign';

// testing no params
const one = createAssign({ name: 'SLICE', initialState: false });
// $ExpectType { set: (payload: boolean) => Action<boolean, string>; reset: () => Action<any, string>; }
one.actions;
// $ExpectType Reducer<boolean, Action<any, string>>
one.reducer;
// $ExpectType string
one.name;

// testing with params
type SliceState = boolean;
const two = createAssign<SliceState>({
  name: 'slice',
  initialState: false,
});
// $ExpectType { set: (payload: boolean) => Action<boolean, string>; reset: () => Action<any, string>; }
two.actions;
// $ExpectType Reducer<boolean, Action<any, string>>
two.reducer;
// $ExpectType string
two.name;
