import robodux, { AnyState, ActionsAny } from './slice';
import { NoEmptyArray } from './reducer';

export const cap = (t: string) => t.charAt(0).toUpperCase() + t.substr(1);

interface Params<SS, S> {
  initialState: NoEmptyArray<SS>;
  slice: keyof S;
  extraActions?: ActionsAny;
}

export default function assignSlice<
  SS = any,
  A extends ActionsAny = any,
  S extends AnyState = AnyState
>({ slice, initialState, extraActions }: Params<SS, S>) {
  return robodux<SS, A, S>({
    slice,
    initialState,
    actions: {
      [`set${cap(<string>slice)}`]: (s: SS, p: SS) => p,
      [`reset${cap(<string>slice)}`]: () => initialState,
    } as any,
    extraActions: extraActions as any,
  });
}
