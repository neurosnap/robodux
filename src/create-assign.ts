import createSlice from './create-slice';
import { SliceHelperRequired } from './types';

export function assignReducers<State>(initialState: State) {
  return {
    set: (s: State, p: State) => p,
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
    reducts: assignReducers(initialState),
    extraReducers,
  });
}
