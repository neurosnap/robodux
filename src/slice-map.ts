import robodux, { AnyState, ActionsAny } from './slice';
import { NoEmptyArray } from './reducer';

export const cap = (t: string) => t.charAt(0).toUpperCase() + t.substr(1);

type Obj = {
  [key: string]: any;
};

export function set<S = Obj>() {
  return (state: S, payload: S): S => payload;
}

export function add<S = Obj>() {
  return (state: S, payload: S): S => {
    Object.keys(payload).forEach((key) => {
      state[key as keyof S] = payload[key as keyof S];
    });
    return state;
  };
}

export function remove<S = Obj>() {
  return (state: S, payload: string[]): S => {
    payload.forEach((key) => {
      delete state[key as keyof S];
    });
    return state;
  };
}

export default function mapSlice<
  SS extends AnyState = AnyState,
  A extends ActionsAny = any,
  S extends AnyState = AnyState
>(slice: keyof S) {
  const initialState = {} as NoEmptyArray<SS>;
  return robodux<SS, A, S>({
    slice,
    initialState,
    actions: {
      [`add${cap(<string>slice)}`]: add<S>(),
      [`set${cap(<string>slice)}`]: set<S>(),
      [`remove${cap(<string>slice)}`]: remove<S>(),
      [`reset${cap(<string>slice)}`]: () => initialState,
    } as any,
  });
}
