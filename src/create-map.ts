import createSlice from './create-slice';
import { AnyState, PatchEntity, SliceHelper } from './types';

export interface MapReducers<State extends AnyState = AnyState> {
  add: (state: State, payload: State) => State;
  set: (state: State, payload: State) => State;
  remove: (state: State, payload: string[]) => State;
  reset: (state: State) => State;
  merge: (state: State, payload: PatchEntity<State>) => State;
  patch: (state: State, payload: PatchEntity<State>) => State;
}

export function mapReducers<State extends AnyState>(
  initialState = {} as State,
): MapReducers<State> {
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

        const entity = payload[id];
        if (entity) {
          // getting weird issue with typing here
          const s: any = newState;
          const nextEntity = { ...s[id] };
          Object.keys(entity).forEach((key) => {
            if (s.hasOwnProperty(id)) {
              nextEntity[key] = (payload[id] as any)[key];
            }
          });
          (newState as any)[id] = nextEntity;
        }
      });

      return newState;
    },
    merge: (
      state: State,
      payload: { [key: string]: Partial<State[keyof State]> },
    ): State => {
      const newState = { ...state };
      Object.keys(payload).forEach((id) => {
        if (typeof payload[id] !== 'object') {
          return;
        }

        const entity = payload[id];
        if (entity) {
          // getting weird issue with typing here
          const s: any = newState;
          if (!s.hasOwnProperty(id)) {
            return;
          }

          const nextEntity = { ...s[id] };
          Object.keys(entity).forEach((key) => {
            const prop = (payload[id] as any)[key];
            if (Array.isArray(nextEntity[key])) {
              nextEntity[key] = [...nextEntity[key], ...prop];
            } else if (Object == prop.constructor) {
              nextEntity[key] = {
                ...nextEntity[key],
                ...prop,
              };
            } else {
              nextEntity[key] = prop;
            }
          });
          (newState as any)[id] = nextEntity;
        }
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

export default function createMap<State extends AnyState>({
  name,
  extraReducers,
  initialState = {} as State,
}: SliceHelper<State>) {
  const slice = createSlice<State, MapActions<State>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: mapReducers(initialState),
  });

  return slice;
}
