import createNextState from 'immer';

import { Action } from './types';
import { ReducerMap } from './types';

export type CreateReducer<SS = any> = {
  initialState: SS;
  reducers: ReducerMap<SS, any>;
  name?: string;
  useImmer?: boolean;
};

export type NoEmptyArray<State> = State extends never[] ? any[] : State;

export default function createReducer<S, SS extends S = any>({
  initialState,
  reducers,
  name = '',
  useImmer = true,
}: CreateReducer<NoEmptyArray<SS>>) {
  const reducerPlain = (state = initialState, action: Action<any>) => {
    const caseReducer = reducers[action.type];
    if (!caseReducer) {
      return state;
    }
    return caseReducer(state as NoEmptyArray<SS>, action.payload);
  };

  const reducerImmer = (state = initialState, action: Action<any>) => {
    return createNextState(state, (draft: NoEmptyArray<SS>) => {
      const caseReducer = reducers[action.type];
      if (!caseReducer) {
        return draft;
      }
      return caseReducer(draft, action.payload);
    });
  };

  const reducer = useImmer ? reducerImmer : reducerPlain;
  reducer.toString = () => name;
  return reducer;
}
