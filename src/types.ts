export interface Action<P = any> {
  readonly type: string;
  readonly payload?: P;
}

export type ActionReducer<SS = any, A = any> = (
  state: SS,
  payload: A,
) => SS | void | undefined;

export type ActionReducerWithSlice<SS = any, A = any, S = any> = (
  state: SS,
  payload: A,
  _FullState: S, // Third argument can be used to type cast State
) => SS | void | undefined;

export type Reducer<SS = any, A extends Action = Action> = (
  state: SS | undefined,
  payload: A,
) => SS;

export type ActionsObj<SS = any, Ax = any> = {
  [K in keyof Ax]: ActionReducer<SS, Ax[K]>
};
export type ActionsObjWithSlice<SS = any, Ax = any, S = any> = {
  [K in keyof Ax]: ActionReducerWithSlice<SS, Ax[K], S>
};

export interface ActionsAny<P = any> {
  [Action: string]: P;
}

export interface AnyState {
  [name: string]: any;
}

export interface ReducerMap<SS, A = Action> {
  [Action: string]: ActionReducer<SS, A>;
}

export type NoBadState<S> = S extends { [x: string]: {} } ? AnyState : S;

export interface PatchEntity<T> {
  [key: string]: Partial<T[keyof T]>;
}
