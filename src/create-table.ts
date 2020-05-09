import createSlice from './create-slice';
import { AnyState, PatchEntity, SliceHelper } from './types';

export function tableReducers<State extends AnyState>(
  initialState = {} as State,
) {
  return {
    add: (state: State, payload: State) => {
      const newState = { ...state };
      Object.keys(payload).forEach((key) => {
        newState[key as keyof State] = payload[key];
      });
      return newState;
    },
    set: (state: State, payload: State) => payload,
    remove: (state: State, payload: string[]) => {
      const newState = { ...state };
      payload.forEach((key) => {
        delete newState[key];
      });
      return newState;
    },
    reset: (state: State) => initialState,
    patch: (
      state: State,
      payload: { [key: string]: Partial<State[keyof State]> },
    ): State => {
      const newState = { ...state };
      Object.keys(payload).forEach((id) => {
        if (typeof payload[id] !== 'object') {
          return;
        }

        Object.keys(payload[id]).forEach((key) => {
          // getting weird issue with typing here
          const s: any = newState;
          if (s.hasOwnProperty(id)) {
            s[id] = { ...s[id], [key]: (payload[id] as any)[key] };
          }
        });
      });

      return newState;
    },
  };
}

interface MapActions<S> {
  add: S;
  set: S;
  remove: string[];
  patch: PatchEntity<S>;
  reset: never;
}

export default function createTable<State extends AnyState>({
  name,
  extraReducers,
  initialState = {} as State,
}: SliceHelper<State>) {
  const slice = createSlice<State, MapActions<State>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: tableReducers(initialState),
  });

  return slice;
}
