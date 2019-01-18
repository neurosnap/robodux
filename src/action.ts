type Creator<P = any> = (p: P) => { type: string; payload?: P };
type CreatorNoPayload = () => { type: string };

export default function creator(type: string): CreatorNoPayload;
export default function creator<P>(type: string): Creator<P>;
export default function creator<P = any>(type: string): CreatorNoPayload {
  function action(payload?: P) {
    if (typeof payload === 'undefined') {
      return { type };
    }

    return {
      type,
      payload,
    };
  }

  action.toString = () => `${type}`;
  return action;
}

export const getActionType = (action: any) => `${action}`;
