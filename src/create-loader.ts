import createSlice from './create-slice';
import { Action, SliceHelper } from './types';
import { Reducer } from 'redux';

const ts = () => Date.now();

export type LoadingStatus = 'loading' | 'success' | 'error' | 'idle';

export interface LoadingItemState<
  M extends Record<string, any> = Record<string, any>,
> {
  status: LoadingStatus;
  message: string;
  lastRun: number;
  lastSuccess: number;
  meta: M;
}

export type LoadingPayload<
  M extends Record<string, any> = Record<string, any>,
> = Partial<{
  message: string;
  timestamp: number;
  meta: M;
}>;

interface LoadingActions<M extends Record<string, any> = Record<string, any>> {
  loading: LoadingPayload<M>;
  success: LoadingPayload<M>;
  error: LoadingPayload<M>;
  reset: never;
}

export function defaultLoadingItem<
  M extends Record<string, any> = Record<string, any>,
>(li: Partial<LoadingItemState<M>> = {}): LoadingItemState<M> {
  return {
    status: 'idle',
    message: '',
    lastRun: 0,
    lastSuccess: 0,
    meta: {} as M,
    ...li,
  };
}

export function loadingReducers<
  M extends Record<string, any> = Record<string, any>,
>(initialState: LoadingItemState<M>) {
  return {
    success: (
      state: LoadingItemState<M> | undefined,
      payload: LoadingPayload<M> = {},
    ) =>
      ({
        status: 'success' as 'success',
        message: payload.message || initialState.message,
        meta: payload.meta || {},
        lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
        lastSuccess: payload.timestamp || ts(),
      } as LoadingItemState<M>),
    error: (
      state: LoadingItemState<M> | undefined,
      payload: LoadingPayload<M> = {},
    ) =>
      ({
        status: 'error' as 'error',
        message: payload.message || initialState.message,
        meta: payload.meta || {},
        lastRun: state && state.lastRun ? state.lastRun : initialState.lastRun,
        lastSuccess:
          state && state.lastSuccess
            ? state.lastSuccess
            : initialState.lastSuccess,
      } as LoadingItemState<M>),
    loading: (
      state: LoadingItemState<M> | undefined,
      payload: LoadingPayload<M> = {},
    ) =>
      ({
        status: 'loading' as 'loading',
        message: payload.message || initialState.message,
        meta: payload.meta || {},
        lastRun: payload.timestamp || ts(),
        lastSuccess:
          state && state.lastSuccess
            ? state.lastSuccess
            : initialState.lastSuccess,
      } as LoadingItemState<M>),
    reset: () => initialState,
  };
}

export default function createLoader<
  M extends Record<string, any> = Record<string, any>,
>({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<M>>): {
  name: string;
  reducer: Reducer<LoadingItemState<M>, Action>;
  actions: {
    [key in keyof LoadingActions]: LoadingActions[key] extends never
      ? () => Action
      : (payload?: LoadingActions<M>[key]) => Action<LoadingActions<M>[key]>;
  };
  toString: () => string;
};
export default function createLoader<
  M extends Record<string, any> = Record<string, any>,
>({
  name,
  initialState,
  extraReducers,
}: SliceHelper<LoadingItemState<M>>): {
  name: string;
  reducer: Reducer<LoadingItemState<M>, Action>;
  actions: {
    [key in keyof LoadingActions]: LoadingActions[key] extends never
      ? () => Action
      : (payload?: LoadingActions[key]) => Action<LoadingActions[key]>;
  };
  toString: () => string;
};
export default function createLoader<
  M extends Record<string, any> = Record<string, any>,
>({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: SliceHelper<LoadingItemState<M>>) {
  return createSlice<LoadingItemState<M>, LoadingActions<M>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: loadingReducers<M>(initialState),
  });
}
