import createSlice from './slice';
import { ActionsAny } from './types';

interface AssignActions<SS> {
  set: SS;
  reset: never;
}

export default function assignSlice<State = any>({
  name,
  initialState,
  extraReducers,
}: {
  name: string;
  initialState: State;
  extraReducers?: ActionsAny;
}) {
  return createSlice<State, AssignActions<State>>({
    name,
    useImmer: false,
    initialState,
    reducts: {
      set: (s: State, p: State) => p,
      reset: () => initialState,
    } as any,
    extraReducers,
  });
}
