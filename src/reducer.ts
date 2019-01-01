import createNextState from 'immer';

import { Action } from './types';
import { ReduceM, Reducer } from './slice';

export type CreateReducer<SS = any> = {
  initialState: SS;
  actions: ReduceM<SS>;
  slice?: string;
};

type NoEmptyArray<State> = State extends never[] ? any[] : State;

export default function createReducer<S, SS extends S = any>({
  initialState,
  actions,
  slice,
}: CreateReducer<NoEmptyArray<SS>>): Reducer<SS>;
export default function createReducer<S>({
  initialState,
  actions,
  slice = '',
}: CreateReducer<S>) {
  const reducer = (state: S = initialState, action: Action<any>): S => {
    return createNextState(<any>state, (draft: S) => {
      const caseReducer = actions[action.type];

      if (caseReducer) {
        return caseReducer(draft, action.payload);
      }

      return draft;
    });
  };

  reducer.toString = () => slice;
  return reducer;
}
