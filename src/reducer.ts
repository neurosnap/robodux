import createNextState from 'immer';

import { Action } from './types';

interface ActionsMap<S> {
  [key: string]: (state: S, action: Action<any>) => S | void;
}

export default function createReducer<S>(
  initialState: S,
  actionsMap: ActionsMap<S>,
) {
  return (state: S = initialState, action: Action<any>) => {
    return createNextState(<any>state, (draft: S) => {
      const caseReducer = actionsMap[action.type];

      if (caseReducer) {
        return caseReducer(draft, action.payload);
      }

      return draft;
    });
  };
}
