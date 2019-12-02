import createSlice from './slice';
import { ActionsAny, Action } from './types';
import { Reducer } from 'redux';

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

interface LoadingActions<M = string, E = string> {
  loading: Partial<{ error: E; message: M }>;
  success: Partial<{ error: E; message: M }>;
  error: Partial<{ error: E; message: M }>;
  reset: never;
}

export default function loadingSlice({
  name,
  initialState,
  extraReducers,
}: {
  name: string;
  initialState?: LoadingItemState<string, string>;
  extraReducers?: ActionsAny;
}): {
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
}: {
  name: string;
  initialState: LoadingItemState<M, E>;
  extraReducers?: ActionsAny;
}): {
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
}: {
  name: string;
  initialState?: LoadingItemState<any, any>;
  extraReducers?: ActionsAny;
}) {
  return createSlice<LoadingItemState<any, any>, LoadingActions<any, any>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: {
      success: (state: LoadingItemState<any, any>, payload = {}) => ({
        error: payload.error || initialState.error,
        message: payload.message || initialState.message,
        loading: false,
        success: true,
      }),
      error: (state: LoadingItemState<any, any>, payload = {}) => ({
        error: payload.error || initialState.error,
        message: payload.message || initialState.message,
        loading: false,
        success: false,
      }),
      loading: (state: LoadingItemState<any, any>, payload = {}) => ({
        error: payload.error || initialState.error,
        message: payload.message || initialState.message,
        loading: true,
        success: false,
      }),
      reset: () => initialState,
    },
  });
}
