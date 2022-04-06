import { createSelector } from 'reselect';

import createSlice from './create-slice';
import type { SliceHelper, PropId, PropIds, MapEntity } from './types';
import { excludesFalse } from './types';
import { mapReducers } from './create-map';
import {
  LoadingItemState,
  LoadingPayload,
  loadingReducers,
  defaultLoadingItem,
} from './create-loader';

export type LoaderTableState<
  M extends Record<string, any> = Record<string, any>,
> = MapEntity<LoadingItemState<M>>;

export interface LoadingState<
  M extends Record<string, any> = Record<string, any>,
> extends LoadingItemState<M> {
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
    isInitialLoading:
      (loading.status === 'idle' || loading.status === 'loading') &&
      loading.lastSuccess === 0,
  };
};

export type LoadingMapPayload<
  M extends Record<string, any> = Record<string, any>,
> = LoadingPayload<M> & { id: string };

function reducerCreator<M extends Record<string, any> = Record<string, any>>(
  reducer: (
    s: LoadingItemState<M> | undefined,
    p: LoadingPayload<M>,
  ) => LoadingItemState<M>,
) {
  return (state: LoaderTableState<M>, payload: LoadingMapPayload<M>) => ({
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

export function loaderTableSelectors<S = any>(
  selectTable: (s: S) => LoaderTableState,
): LoaderTableSelectors<S> {
  const findById = (data: LoaderTableState = {}, { id }: PropId) =>
    defaultLoader(data[id]);
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

interface LoadingMapActions<
  M extends Record<string, any> = Record<string, any>,
> {
  loading: LoadingMapPayload<M>;
  success: LoadingMapPayload<M>;
  error: LoadingMapPayload<M>;
  remove: string[];
  resetById: string;
  resetAll: never;
}

export default function createLoaderTable<
  M extends Record<string, any> = Record<string, any>,
>({
  name,
  initialState = {},
  extraReducers,
}: SliceHelper<LoaderTableState<M>>) {
  const loading = loadingReducers<M>(defaultLoadingItem<M>());
  const map = mapReducers(initialState);

  const slice = createSlice<LoaderTableState<M>, LoadingMapActions<M>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: {
      loading: reducerCreator<M>(loading.loading as any),
      success: reducerCreator<M>(loading.success as any),
      error: reducerCreator<M>(loading.error as any),
      resetById: (state: LoaderTableState<M>, id: string) => ({
        ...state,
        [id]: loading.reset(),
      }),
      remove: map.remove,
      resetAll: map.reset,
    },
  });

  return {
    ...slice,
    getSelectors: <S>(stateFn: (s: S) => LoaderTableState<M>) =>
      loaderTableSelectors(stateFn),
  };
}
