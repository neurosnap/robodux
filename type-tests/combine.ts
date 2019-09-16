import createSlice from '../src/slice';
import { createActionMap, createReducerMap } from '../src/combine';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducts: {
    inc: (state) => state + 1,
    dec: (state) => state - 1,
  },
});

const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducts: {
    loading: (state, payload: boolean) => payload,
  },
});

const actions = createActionMap(counterSlice, loadingSlice);
// $ExpectType { inc: (payload?: any) => Action<any>; dec: (payload?: any) => Action<any>; loading: (payload: boolean) => Action<boolean>; }
actions;
const reducers = createReducerMap(counterSlice, loadingSlice);
// $ExpectType { counter: Reducer<number, Action<any>>; loading: Reducer<boolean, Action<any>>; }
reducers;
