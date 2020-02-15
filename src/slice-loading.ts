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
      timestamp: payload.timestamp || ts(),
    }),
    error: (state: LoadingItemState<any>, payload: LoadingPayload<M> = {}) => ({
      error: true,
      message: payload.message || initialState.message,
      loading: false,
      success: false,
      timestamp: payload.timestamp || ts(),
    }),
    loading: (
      state: LoadingItemState<any>,
      payload: LoadingPayload<M> = {},
    ) => ({
      error: false,
      message: payload.message || initialState.message,
      loading: true,
      success: false,
      timestamp: payload.timestamp || ts(),
    }),
    reset: () => initialState,
  };
}

export interface LoadingItemState<M = string> {
  message: M;
  error: boolean;
  loading: boolean;
  success: boolean;
  timestamp: number;
}

export function defaultLoadingItem(): LoadingItemState<string> {
  return {
    error: false,
    message: '',
    loading: false,
    success: false,
    timestamp: ts(),
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
