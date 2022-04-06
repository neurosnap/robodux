import createSlice from '../src/create-slice';
import { createActionMap, createReducerMap } from '../src/combine';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    inc: (state) => state + 1,
    dec: (state) => state - 1,
  },
});

const createLoader = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    loading: (_, payload: boolean) => payload,
  },
});

const actions = createActionMap(counterSlice, createLoader);
// $ExpectType { inc: (payload?: any) => Action<any, string>; dec: (payload?: any) => Action<any, string>; loading: (payload: boolean) => Action<boolean, string>; }
actions;
const reducers = createReducerMap(counterSlice, createLoader);
// $ExpectType { [x: string]: Reducer<number, Action<any, string>> | Reducer<boolean, Action<any, string>>; }
reducers;
