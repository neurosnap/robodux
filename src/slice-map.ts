import robodux, { AnyState } from './slice';
import { NoEmptyArray } from './reducer';

const cap = (t: string) => t.charAt(0).toUpperCase() + t.substr(1);

type Obj = {
  [key: string]: any;
};

function set<S = Obj>() {
  return (state: S, payload: S): S => payload;
}

function add<S = Obj>() {
  return (state: S, payload: S): S => {
    Object.keys(payload).forEach((key) => {
      state[key as keyof S] = payload[key as keyof S];
    });
    return state;
  };
}

function remove<S = Obj>() {
  return (state: S, payload: string[]): S => {
    payload.forEach((key) => {
      delete state[key as keyof S];
    });
    return state;
  };
}

export default function mapSlice<
  SS extends AnyState = any,
  A = any,
  S extends AnyState = any
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
