export interface Action<P = any> {
  readonly type: string;
  readonly payload?: P;
}
