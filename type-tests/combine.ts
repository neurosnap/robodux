import createApp from '../src/create-app';
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
// $ExpectType { inc: (payload?: any) => Action<any, string>; dec: (payload?: any) => Action<any, string>; loading: (payload: boolean) => Action<boolean, string>; }
actions;
const reducers = createReducerMap(counterSlice, loadingSlice);
// $ExpectType { [x: string]: Reducer<number, Action<any, string>> | Reducer<boolean, Action<any, string>>; }
reducers;

const modA = {
  reducers: { counter: counterSlice.reducer },
};
const modB = {
  reducers: { loading: loadingSlice.reducer },
};

interface LocalState {
  loading: boolean;
  counter: number;
}
const app = createApp<LocalState>([modA, modB]);
// $ExpectType { reducer: Reducer<LocalState, AnyAction>; }
app;
