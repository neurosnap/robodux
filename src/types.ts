import { Action as BaseAction } from 'redux';

export interface Action<P = any, T extends string = string>
  extends BaseAction<T> {
  payload?: P;
}

export interface ActionWithPayload<P = any, T extends string = string>
  extends BaseAction<T> {
  payload: P;
}

export type ActionReducer<SliceState = any, A = any> = (
  state: SliceState,
  payload: A,
) => SliceState | void | undefined;

export type ActionsObjWithSlice<SliceState = any, Ax = any> = {
  [K in keyof Ax]: ActionReducer<SliceState, Ax[K]>;
};

export interface ActionsAny<P = any> {
  [Action: string]: P;
}

export interface AnyState {
  [name: string]: any;
}

export interface ReducerMap<SliceState, A = Action> {
  [Action: string]: ActionReducer<SliceState, A>;
}

export interface PatchEntity<T> {
  [key: string]: Partial<T[keyof T]>;
}
