import createSlice from './slice';
import { NoEmptyArray } from './reducer';
import { AnyState, ActionsAny } from './types';
import { cap } from './util';

export function setMap<S = AnyState>() {
  return (state: S, payload: S): S => payload;
}

export function addMap<S = AnyState>() {
  return (state: S, payload: S): S => {
    Object.keys(payload).forEach((key) => {
      state[key as keyof S] = payload[key as keyof S];
    });
    return state;
  };
}

export function removeMap<S = AnyState>() {
  return (state: S, payload: string[]): S => {
    payload.forEach((key) => {
      delete state[key as keyof S];
    });
    return state;
  };
}

export function patchMap<S = AnyState, A extends ActionsAny = any>() {
  return (state: S, payload: { [key: string]: Partial<A[keyof A]> }): S => {
    Object.keys(payload).forEach((id) => {
      if (typeof payload[id] !== 'object') {
        return state;
      }

      Object.keys(payload[id]).forEach((key) => {
        if (state.hasOwnProperty(id)) {
          (state as any)[id][key] = payload[id][key];
        }
      });
    });

    return state;
  };
}

export default function mapSlice<
  SS extends AnyState = AnyState,
  A extends ActionsAny = any,
  S extends AnyState = AnyState
>({ name, extraReducers }: { name: keyof S; extraReducers?: ActionsAny }) {
  const initialState = {} as NoEmptyArray<SS>;
  return createSlice<SS, A, S>({
    name,
    useImmer: false,
    initialState,
    reducts: {
      [`add${cap(<string>name)}`]: addMap<S>(),
      [`set${cap(<string>name)}`]: setMap<S>(),
      [`patch${cap(<string>name)}`]: patchMap<S, A>(),
      [`remove${cap(<string>name)}`]: removeMap<S>(),
      [`reset${cap(<string>name)}`]: () => initialState,
    } as any,
    extraReducers,
  });
}
