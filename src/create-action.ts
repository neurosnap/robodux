import type { ActionWithPayload } from './types';

type Creator<P = any, T extends string = string> = (
  p: P,
) => ActionWithPayload<P, T>;
type CreatorNoPayload<T extends string = string> = () => ActionWithPayload<
  undefined,
  T
>;

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
