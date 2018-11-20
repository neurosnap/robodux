import { ActionType } from './types';

export default function creator<P = any>(type: ActionType) {
  const action = (payload: P) => ({
    type,
    payload,
  });

  action.toString = () => `${type}`;
  return action;
}

export const getActionType = (action: any) => `${action}`;
