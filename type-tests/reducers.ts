import { tableReducers } from '../src/create-table';

interface State {
  [key: string]: number;
}

const state = {};
const reducers = tableReducers<State>();
// $ExpectType (state: State, payload: State) => State
reducers.add;
// $ExpectError Type 'string' is not assignable to type 'number'.
reducers.add(state, { 1: 'test' });
// $ExpectType (state: State, payload: { [key: string]: number; }) => State
reducers.patch;
// $ExpectType (state: State, payload: string[]) => State
reducers.remove;
// $ExpectType (state: State) => State
reducers.reset;
// $ExpectType (state: State, payload: State) => State
reducers.set;
