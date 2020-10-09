import createNextState from 'immer';

import { Action } from './types';
import { ReducerMap } from './types';
import { Reducer } from 'redux';

export type CreateReducer<State = any> = {
  initialState: State;
  reducers: ReducerMap<State, any>;
  useImmer?: boolean;
};

export function createReducerPlain<State = any>(
  initialState: State,
  reducers: ReducerMap<State>,
): Reducer<State, Action<any>> {
  const reducer = (state = initialState, action: Action<any>) => {
    const caseReducer = reducers[action.type];
    if (!caseReducer) {
      return state;
    }
    return caseReducer(state, action.payload) as State;
  };

  return reducer;
}

export default function createReducer<State = any>(
  initialState: State,
  reducers: ReducerMap<State>,
): Reducer<State, Action<any>> {
  const reducer = (state = initialState, action: Action<any>) => {
    return createNextState<State>(state, (draft) => {
      const caseReducer = reducers[action.type];
      if (!caseReducer) {
        return draft;
      }
      return caseReducer(draft as State, action.payload);
    });
  };

  return reducer;
}
