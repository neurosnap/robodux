import createSlice from './slice';
import { AnyState, ActionsAny, PatchEntity } from './types';

interface MapActions<S> {
  add: S;
  set: S;
  remove: string[];
  patch: PatchEntity<S>;
  reset: never;
}

export default function mapSlice<State extends AnyState>({
  name,
  extraReducers,
  initialState = {} as State,
}: {
  name: string;
  extraReducers?: ActionsAny;
  initialState?: State;
}) {
  return createSlice<State, MapActions<State>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: {
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
    },
  });
}
