import robodux from './slice';
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
      Object.keys(payload[id]).forEach((key) => {
        if (
          state.hasOwnProperty(id) &&
          state[id as keyof S].hasOwnProperty(key)
        ) {
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
>({ slice, extraActions }: { slice: keyof S; extraActions?: ActionsAny }) {
  const initialState = {} as NoEmptyArray<SS>;
  return robodux<SS, A, S>({
    slice,
    initialState,
    actions: {
      [`add${cap(<string>slice)}`]: addMap<S>(),
      [`set${cap(<string>slice)}`]: setMap<S>(),
      [`patch${cap(<string>slice)}`]: patchMap<S, A>(),
      [`remove${cap(<string>slice)}`]: removeMap<S>(),
      [`reset${cap(<string>slice)}`]: () => initialState,
    } as any,
    extraActions,
  });
}
