import createNextState from 'immer';

import { Action } from './types';

interface ActionsMap<S> {
  [key: string]: (state: S, action: Action<any>) => S | void;
}

interface ICreateReducer<S> {
  initialState: S;
  actions: ActionsMap<S>;
  slice?: string;
}

export default function createReducer<S>({
  initialState,
  actions,
  slice = '',
}: ICreateReducer<S>) {
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
