import createSlice from './create-slice';
import { Action, SliceHelper } from './types';
import { Reducer } from 'redux';

export function loadingReducers<M, E>(initialState: LoadingItemState<M, E>) {
  return {
    success: (
      state: LoadingItemState<any, any>,
      payload: LoadingPayload<M, E> = {},
    ) => ({
      error: payload.error || initialState.error,
      message: payload.message || initialState.message,
      loading: false,
      success: true,
    }),
    error: (
      state: LoadingItemState<any, any>,
      payload: LoadingPayload<M, E> = {},
    ) => ({
      error: payload.error || initialState.error,
      message: payload.message || initialState.message,
      loading: false,
      success: false,
    }),
    loading: (
      state: LoadingItemState<any, any>,
      payload: LoadingPayload<M, E> = {},
    ) => ({
      error: payload.error || initialState.error,
      message: payload.message || initialState.message,
      loading: true,
      success: false,
    }),
    reset: () => initialState,
  };
}

export interface LoadingItemState<M = string, E = string> {
  message: M;
  error: E;
  loading: boolean;
  success: boolean;
}

export function defaultLoadingItem(): LoadingItemState<string, string> {
  return {
    error: '',
    message: '',
    loading: false,
    success: false,
  };
}

export type LoadingPayload<M = string, E = string> = Partial<{
  error: E;
  message: M;
}>;

interface LoadingActions<M = string, E = string> {
  loading: LoadingPayload<M, E>;
  success: LoadingPayload<M, E>;
  error: LoadingPayload<M, E>;
  reset: never;
}

export default function loadingSlice({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<string, string>>): {
  name: string;
  reducer: Reducer<LoadingItemState<string, string>, Action>;
  actions: {
    [key in keyof LoadingActions<string, string>]: LoadingActions<
      string,
      string
    >[key] extends never
      ? () => Action
      : (
          payload?: LoadingActions<string, string>[key],
        ) => Action<LoadingActions<string, string>[key]>;
  };
  toString: () => string;
};
export default function loadingSlice<M, E>({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<M, E>>): {
  name: string;
  reducer: Reducer<LoadingItemState<M, E>, Action>;
  actions: {
    [key in keyof LoadingActions<M, E>]: LoadingActions<M, E>[key] extends never
      ? () => Action
      : (
          payload?: LoadingActions<M, E>[key],
        ) => Action<LoadingActions<M, E>[key]>;
  };
  toString: () => string;
};
export default function loadingSlice({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: SliceHelper<LoadingItemState<any, any>>) {
  return createSlice<LoadingItemState<any, any>, LoadingActions<any, any>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: loadingReducers(initialState),
  });
}
