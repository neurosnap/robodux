import createNextState from 'immer';

import { Action } from './types';
import { ReducerMap } from './slice';

export type CreateReducer<SS = any> = {
  initialState: SS;
  actions: ReducerMap<SS, any>;
  slice?: string;
  useImmer?: boolean;
};

export type NoEmptyArray<State> = State extends never[] ? any[] : State;

export default function createReducer<S, SS extends S = any>({
  initialState,
  actions,
  slice = '',
  useImmer = true,
}: CreateReducer<NoEmptyArray<SS>>) {
  const reducerPlain = (state = initialState, action: Action<any>) => {
    const caseReducer = actions[action.type];
    if (!caseReducer) {
      return state;
    }
    return caseReducer(state as NoEmptyArray<SS>, action.payload);
  };

  const reducerImmer = (state = initialState, action: Action<any>) => {
    return createNextState(state, (draft) => {
      const caseReducer = actions[action.type];
      if (!caseReducer) {
        return draft;
      }
      return caseReducer(draft as NoEmptyArray<SS>, action.payload);
    });
  };

  const reducer = useImmer ? reducerImmer : reducerPlain;
  reducer.toString = () => slice;
  return reducer;
}
