import robodux from './slice';
import { AnyState, ActionsAny } from './types';
import { NoEmptyArray } from './reducer';
import { cap } from './util';

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
    extraActions,
  });
}
