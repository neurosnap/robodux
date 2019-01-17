type Creator<P = never> = (p?: P) => { type: string; payload?: P };

export default function creator<P = never>(type: string): Creator<P> {
  function action(payload?: P) {
    if (!payload) {
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
