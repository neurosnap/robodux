/**
 * Inlined from redux
 */
export interface BaseAction<T extends string = string> {
  type: T;
}

/**
 * Inlined from redux
 */
export interface AnyAction extends BaseAction {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

/**
 * Inlined from redux
 */
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A,
) => S;

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

export interface MapEntity<E> {
  [key: string]: E | undefined;
}

export const excludesFalse = <T>(n?: T): n is T => Boolean(n);

export interface ReducerMap<SliceState, A = Action> {
  [Action: string]: ActionReducer<SliceState, A>;
}

export interface PatchEntity<T> {
  [key: string]: Partial<T[keyof T]>;
}

export interface SliceHelper<State> {
  name: string;
  initialState?: State;
  extraReducers?: ActionsAny;
}

export interface SliceHelperRequired<State> {
  name: string;
  initialState: State;
  extraReducers?: ActionsAny;
}

export interface PropId {
  id: string;
}

export interface PropIds {
  ids: string[];
}
