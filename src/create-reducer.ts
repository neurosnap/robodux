import createNextState, { Draft } from 'immer';

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
  const reducer = (state = initialState, action: Action<any>): State => {
    // @ts-ignore createNextState() produces an Immutable<Draft<S>> rather
    // than an Immutable<S>, and TypeScript cannot find out how to reconcile
    // these two types.
    return createNextState(state, (draft: Draft<State>) => {
      const caseReducer = reducers[action.type];
      if (!caseReducer) {
        return draft;
      }
      return caseReducer(draft as any, action.payload);
    });
  };

  return reducer;
}
