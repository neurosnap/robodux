import createSlice from './create-slice';
import { Action, SliceHelper } from './types';
import { Reducer } from 'redux';

const ts = () => Date.now();

export type LoadingStatus = 'loading' | 'success' | 'error' | 'idle';

export interface LoadingItemState {
  status: LoadingStatus;
  message: string;
  lastRun: number;
  lastSuccess: number;
  meta: { [key: string]: any };
}

export type LoadingPayload = Partial<{
  message: string;
  timestamp: number;
  meta: { [key: string]: any };
}>;

interface LoadingActions {
  loading: LoadingPayload;
  success: LoadingPayload;
  error: LoadingPayload;
  reset: never;
}

export function defaultLoadingItem(
  li: Partial<LoadingItemState> = {},
): LoadingItemState {
  return {
    status: 'idle',
    message: '',
    lastRun: 0,
    lastSuccess: 0,
    meta: {},
    ...li,
  };
}

export function loadingReducers(initialState: LoadingItemState) {
  return {
    success: (
      state: LoadingItemState | undefined,
      payload: LoadingPayload = {},
    ) => ({
      status: 'success' as 'success',
      message: payload.message || initialState.message,
      meta: payload.meta || {},
      lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
      lastSuccess: payload.timestamp || ts(),
    }),
    error: (
      state: LoadingItemState | undefined,
      payload: LoadingPayload = {},
    ) => ({
      status: 'error' as 'error',
      message: payload.message || initialState.message,
      meta: payload.meta || {},
      lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
      lastSuccess:
        state && state.lastSuccess
          ? state.lastSuccess
          : initialState.lastSuccess,
    }),
    loading: (
      state: LoadingItemState | undefined,
      payload: LoadingPayload = {},
    ) => ({
      status: 'loading' as 'loading',
      message: payload.message || initialState.message,
      meta: payload.meta || {},
      lastRun: payload.timestamp || ts(),
      lastSuccess:
        state && state.lastSuccess
          ? state.lastSuccess
          : initialState.lastSuccess,
    }),
    reset: () => initialState,
  };
}

export default function createLoader({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState>): {
  name: string;
  reducer: Reducer<LoadingItemState, Action>;
  actions: {
    [key in keyof LoadingActions]: LoadingActions[key] extends never
      ? () => Action
      : (payload?: LoadingActions[key]) => Action<LoadingActions[key]>;
  };
  toString: () => string;
};
export default function createLoader<M>({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState>): {
  name: string;
  reducer: Reducer<LoadingItemState, Action>;
  actions: {
    [key in keyof LoadingActions]: LoadingActions[key] extends never
      ? () => Action
      : (payload?: LoadingActions[key]) => Action<LoadingActions[key]>;
  };
  toString: () => string;
};
export default function createLoader({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: SliceHelper<LoadingItemState>) {
  return createSlice<LoadingItemState, LoadingActions>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: loadingReducers(initialState),
  });
}
