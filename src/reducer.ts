import createNextState from 'immer';

import { Action } from './types';

interface ActionsMap<S> {
  [key: string]: (state: S, action: Action<any>) => S | void;
}

interface ICreateReducer<S> {
  initialState: S;
  actions: ActionsMap<S>;
}

export default function createReducer<S>({
  initialState,
  actions,
}: ICreateReducer<S>) {
  return (state: S = initialState, action: Action<any>) => {
    return createNextState(<any>state, (draft: S) => {
      const caseReducer = actions[action.type];

      if (caseReducer) {
        return caseReducer(draft, action.payload);
      }

      return draft;
    });
  };
}
