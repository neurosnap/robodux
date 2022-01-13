import createSlice from './create-slice';
import { SliceHelper } from './types';

export function listReducers<State extends any[]>(
  initialState = [] as unknown as State,
) {
  return {
    add: (state: State, payload: State): State => {
      return [...state, ...payload] as State;
    },
    remove: (state: State, payload: number[]): State => {
      const newState = [...state] as State;
      payload.forEach((index) => {
        newState.splice(index, 1);
      });
      return newState;
    },
    reset: (state: State): State => initialState,
  };
}

interface ListActions<S> {
  add: S;
  remove: number[];
  reset: never;
}

export default function createList<State extends any[]>({
  name,
  extraReducers,
  initialState = [] as unknown as State,
}: SliceHelper<State>) {
  const slice = createSlice<State, ListActions<State>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: listReducers(initialState),
  });

  return slice;
}
