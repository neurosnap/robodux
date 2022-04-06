import createSlice from './create-slice';
import type { SliceHelperRequired } from './types';

export function assignReducers<State>(initialState: State) {
  return {
    set: (_: State, p: State) => p,
    reset: () => initialState,
  };
}

interface AssignActions<SS> {
  set: SS;
  reset: never;
}

export default function createAssign<State = any>({
  name,
  initialState,
  extraReducers,
}: SliceHelperRequired<State>) {
  return createSlice<State, AssignActions<State>>({
    name,
    useImmer: false,
    initialState,
    reducers: assignReducers(initialState),
    extraReducers,
  });
}
