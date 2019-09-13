import createNextState from 'immer';

import { Action } from './types';
import { ReducerMap } from './types';

export type CreateReducer<SS = any> = {
  initialState: SS;
  reducers: ReducerMap<SS, any>;
  name?: string;
};

export type NoEmptyArray<State> = State extends never[] ? any[] : State;

export default function createReducer<S, SS extends S = any>({
  initialState,
  reducers,
  name = '',
}: CreateReducer<NoEmptyArray<SS>>) {
  const reducer = (state = initialState, action: Action<any>) => {
    return createNextState(state, (draft: NoEmptyArray<SS>) => {
      const caseReducer = reducers[action.type];

      if (caseReducer) {
        return caseReducer(draft, action.payload);
      }

      return draft;
    });
  };

  reducer.toString = () => name;
  return reducer;
}
