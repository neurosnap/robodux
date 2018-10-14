export type ActionType = string;
export interface Action<P> {
  readonly type: ActionType;
  readonly payload: P;
}
