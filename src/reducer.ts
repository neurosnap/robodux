import createNextState from 'immer';

import { Action } from './types';
import { ReducerMap } from './types';
import { Reducer } from 'redux';

export type CreateReducer<State = any> = {
  initialState: State;
  reducers: ReducerMap<State, any>;
  name?: string;
  useImmer?: boolean;
};

export default function createReducer<State = any>({
  initialState,
  reducers,
  name = '',
  useImmer = true,
}: CreateReducer<State>): Reducer<State, Action<any>> {
  const reducerPlain = (state = initialState, action: Action<any>) => {
    const caseReducer = reducers[action.type];
    if (!caseReducer) {
      return state;
    }
    return caseReducer(state, action.payload) as State;
  };

  const reducerImmer = (state = initialState, action: Action<any>) => {
    return createNextState<State>(state, (draft) => {
      const caseReducer = reducers[action.type];
      if (!caseReducer) {
        return draft;
      }
      return caseReducer(draft as State, action.payload);
    });
  };

  const reducer = useImmer ? reducerImmer : reducerPlain;
  reducer.toString = () => name;
  return reducer;
}
