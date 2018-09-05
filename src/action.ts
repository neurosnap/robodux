import { Action, ActionType } from './types';

export default function creator<P>(type: ActionType) {
  const action = (payload?: P): Action<P> => ({
    type,
    payload,
  });

  action.toString = () => `${type}`;
  return action;
}

export const getType = (action: any) => `${action}`;
