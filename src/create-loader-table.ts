import { createSelector } from 'reselect';

import createSlice from './create-slice';
import { SliceHelper, PropId, PropIds, excludesFalse } from './types';
import { mapReducers } from './create-map';
import {
  LoadingItemState,
  LoadingPayload,
  loadingReducers,
  defaultLoadingItem,
} from './create-loader';
import { MapEntity } from './types';

export type LoaderTableState = MapEntity<LoadingItemState>;

export interface LoadingState extends LoadingItemState {
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
}

export const defaultLoader = (
  l: Partial<LoadingItemState> = {},
): LoadingState => {
  const loading = defaultLoadingItem(l);
  return {
    ...loading,
    isIdle: loading.status === 'idle',
    isError: loading.status === 'error',
    isSuccess: loading.status === 'success',
    isLoading: loading.status === 'loading',
    isInitialLoading: loading.status === 'loading' && loading.lastRun === 0,
  };
};

export type LoadingMapPayload = LoadingPayload & { id: string };

function reducerCreator(
  reducer: (
    s: LoadingItemState | undefined,
    p: LoadingPayload,
  ) => LoadingItemState,
) {
  return (state: LoaderTableState, payload: LoadingMapPayload) => ({
    ...state,
    [payload.id]: reducer(state[payload.id], payload),
  });
}

export interface LoaderTableSelectors<S = any> {
  findById: (d: LoaderTableState, { id }: PropId) => LoadingState;
  findByIds: (d: LoaderTableState, { ids }: PropIds) => LoadingState[];
  selectTable: (s: S) => LoaderTableState;
  selectById: (s: S, p: PropId) => LoadingState;
  selectByIds: (s: S, p: { ids: string[] }) => LoadingState[];
}

export function loaderTableSelectors<M = string, S = any>(
  selectTable: (s: S) => LoaderTableState,
): LoaderTableSelectors<S> {
  const initLoader = defaultLoader();
  const findById = (data: LoaderTableState, { id }: PropId) =>
    defaultLoader(data[id]) || initLoader;
  const findByIds = (
    data: LoaderTableState,
    { ids }: PropIds,
  ): LoadingState[] =>
    ids
      .map((id) => data[id])
      .filter(excludesFalse)
      .map((loader) => defaultLoader(loader));

  const selectById = createSelector(
    selectTable,
    (s: S, p: PropId) => p,
    findById,
  );
  const selectByIds = createSelector(
    selectTable,
    (s: S, p: PropIds) => p,
    findByIds,
  );

  return {
    findById,
    findByIds,
    selectTable,
    selectById,
    selectByIds,
  };
}

interface LoadingMapActions {
  loading: LoadingMapPayload;
  success: LoadingMapPayload;
  error: LoadingMapPayload;
  remove: string[];
  resetById: string;
  resetAll: never;
}

export default function createLoaderTable({
  name,
  initialState = {},
  extraReducers,
}: SliceHelper<LoaderTableState>) {
  const loading = loadingReducers(defaultLoadingItem());
  const map = mapReducers(initialState);

  const slice = createSlice<LoaderTableState, LoadingMapActions>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: {
      loading: reducerCreator(loading.loading),
      success: reducerCreator(loading.success),
      error: reducerCreator(loading.error),
      resetById: (state: LoaderTableState, id: string) => ({
        ...state,
        [id]: loading.reset(),
      }),
      remove: map.remove,
      resetAll: map.reset,
    },
  });

  return {
    ...slice,
    getSelectors: <S>(stateFn: (s: S) => LoaderTableState) =>
      loaderTableSelectors(stateFn),
  };
}
