type Creator<P = any, T extends string = string> = (
  p: P,
) => { type: T; payload: P };
type CreatorNoPayload<T extends string = string> = () => {
  type: T;
  payload: undefined;
};

export default function creator(type: string): CreatorNoPayload<string>;
export default function creator<P, T extends string = string>(
  type: string,
): Creator<P, T>;
export default function creator<T extends string = string>(type: T) {
  function action(payload?: any) {
    return {
      type,
      payload,
    };
  }

  action.toString = (): T => `${type}` as T;
  action.type = type;
  return action;
}
