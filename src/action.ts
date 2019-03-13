type Creator<P = any, T extends string = string> = (
  p: P,
) => { type: T; payload?: P };
type CreatorNoPayload<T extends string = string> = () => { type: T };

export default function creator(type: string): CreatorNoPayload;
export default function creator<P, T extends string = string>(
  type: string,
): Creator<P, T>;
export default function creator<P = any, T extends string = string>(
  type: T,
): CreatorNoPayload {
  function action(payload?: P) {
    if (typeof payload === 'undefined') {
      return { type };
    }

    return {
      type,
      payload,
    };
  }

  action.toString = (): T => `${type}` as T;
  action.type = type;
  return action;
}
