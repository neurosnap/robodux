export default function creator<P = any>(type: string) {
  const action = (payload: P) => ({
    type,
    payload,
  });

  action.toString = () => `${type}`;
  return action;
}

export const getActionType = (action: any) => `${action}`;
