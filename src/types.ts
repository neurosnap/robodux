export type ActionType = string;
export interface Action<P> {
  readonly type: ActionType;
  readonly payload: P;
}
export type ActionCreator = (payload?: any) => Action<any>;
export interface ActionMap {
  [key: string]: ActionCreator;
}
