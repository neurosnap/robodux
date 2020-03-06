import createSlice from './create-slice';
import { Action, SliceHelper } from './types';
import { Reducer } from 'redux';

const ts = () => Date.now();

export function loadingReducers<M>(initialState: LoadingItemState<M>) {
  return {
    success: (
      state: LoadingItemState<any>,
      payload: LoadingPayload<M> = {},
    ) => ({
      error: false,
      message: payload.message || initialState.message,
      loading: false,
      success: true,
      lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
      lastSuccess: payload.timestamp || ts(),
    }),
    error: (state: LoadingItemState<any>, payload: LoadingPayload<M> = {}) => ({
      error: true,
      message: payload.message || initialState.message,
      loading: false,
      success: false,
      lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
      lastSuccess:
        state && state.lastSuccess
          ? state.lastSuccess
          : initialState.lastSuccess,
    }),
    loading: (
      state: LoadingItemState<any>,
      payload: LoadingPayload<M> = {},
    ) => ({
      error: false,
      message: payload.message || initialState.message,
      loading: true,
      success: false,
      lastRun: payload.timestamp || ts(),
      lastSuccess:
        state && state.lastSuccess
          ? state.lastSuccess
          : initialState.lastSuccess,
    }),
    reset: () => initialState,
  };
}

export interface LoadingItemState<M = string> {
  message: M;
  error: boolean;
  loading: boolean;
  success: boolean;
  lastRun: number;
  lastSuccess: number;
}

export function defaultLoadingItem(): LoadingItemState<string> {
  return {
    error: false,
    message: '',
    loading: false,
    success: false,
    lastRun: 0,
    lastSuccess: 0,
  };
}

export type LoadingPayload<M = string> = Partial<{
  message: M;
  timestamp: number;
}>;

interface LoadingActions<M = string> {
  loading: LoadingPayload<M>;
  success: LoadingPayload<M>;
  error: LoadingPayload<M>;
  reset: never;
}

export default function loadingSlice({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<string>>): {
  name: string;
  reducer: Reducer<LoadingItemState<string>, Action>;
  actions: {
    [key in keyof LoadingActions<string>]: LoadingActions<
      string
    >[key] extends never
      ? () => Action
      : (
          payload?: LoadingActions<string>[key],
        ) => Action<LoadingActions<string>[key]>;
  };
  toString: () => string;
};
export default function loadingSlice<M>({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<M>>): {
  name: string;
  reducer: Reducer<LoadingItemState<M>, Action>;
  actions: {
    [key in keyof LoadingActions<M>]: LoadingActions<M>[key] extends never
      ? () => Action
      : (payload?: LoadingActions<M>[key]) => Action<LoadingActions<M>[key]>;
  };
  toString: () => string;
};
export default function loadingSlice({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: SliceHelper<LoadingItemState<any>>) {
  return createSlice<LoadingItemState<any>, LoadingActions<any>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: loadingReducers(initialState),
  });
}
