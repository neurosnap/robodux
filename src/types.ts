export type ActionType = string;
export interface Action<P = any> {
  readonly type: ActionType;
  readonly payload?: P;
}
