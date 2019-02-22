import robodux, { AnyState, ActionsAny } from './slice';
import { NoEmptyArray } from './reducer';

export const cap = (t: string) => t.charAt(0).toUpperCase() + t.substr(1);

type Obj = {
  [key: string]: any;
};

export function setMap<S = Obj>() {
  return (state: S, payload: S): S => payload;
}

export function addMap<S = Obj>() {
  return (state: S, payload: S): S => {
    Object.keys(payload).forEach((key) => {
      state[key as keyof S] = payload[key as keyof S];
    });
    return state;
  };
}

export function removeMap<S = Obj>() {
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
>({ slice, extraActions }: { slice: keyof S; extraActions?: ActionsAny }) {
  const initialState = {} as NoEmptyArray<SS>;
  return robodux<SS, A, S>({
    slice,
    initialState,
    actions: {
      [`add${cap(<string>slice)}`]: addMap<S>(),
      [`set${cap(<string>slice)}`]: setMap<S>(),
      [`remove${cap(<string>slice)}`]: removeMap<S>(),
      [`reset${cap(<string>slice)}`]: () => initialState,
    } as any,
    extraActions,
  });
}
