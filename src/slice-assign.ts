import createSlice from './slice';
import { AnyState, ActionsAny } from './types';
import { NoEmptyArray } from './reducer';
import { cap } from './util';

interface Params<SS, S> {
  initialState: NoEmptyArray<SS>;
  name: keyof S;
  extraReducers?: ActionsAny;
}

export default function assignSlice<
  SS = any,
  A extends ActionsAny = any,
  S extends AnyState = AnyState
>({ name, initialState, extraReducers }: Params<SS, S>) {
  return createSlice<SS, A, S>({
    name,
    useImmer: false,
    initialState,
    reducts: {
      [`set${cap(<string>name)}`]: (s: SS, p: SS) => p,
      [`reset${cap(<string>name)}`]: () => initialState,
    } as any,
    extraReducers,
  });
}
