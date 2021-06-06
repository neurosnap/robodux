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

interface State<M> {
  [key: string]: LoadingItemState<M>;
}

export type LoadingMapPayload<M> = LoadingPayload<M> & { id: string };

function reducerCreator<M>(
  reducer: (
    s: LoadingItemState<M>,
    p: LoadingPayload<M>,
  ) => LoadingItemState<M>,
) {
  return (state: State<M>, payload: LoadingMapPayload<M>) => ({
    ...state,
    [payload.id]: reducer(state[payload.id], payload),
  });
}

export interface LoaderTableSelectors<M = string, S = any> {
  findById: (d: State<M>, { id }: PropId) => LoadingItemState<M>;
  findByIds: (d: State<M>, { ids }: PropIds) => LoadingItemState<M>[];
  selectTable: (s: S) => State<M>;
  selectById: (s: S, p: PropId) => LoadingItemState<M>;
  selectByIds: (s: S, p: { ids: string[] }) => LoadingItemState<M>[];
}

export function loaderTableSelectors<M = string, S = any>(
  selectTable: (s: S) => State<M>,
): LoaderTableSelectors<M, S> {
  const initLoader = defaultLoadingItem();
  const findById = (data: State<M>, { id }: PropId) => data[id] || initLoader;
  const findByIds = (data: State<M>, { ids }: PropIds): LoadingItemState<M>[] =>
    ids.map((id) => data[id]).filter(excludesFalse);
  const selectById = (state: S, { id }: PropId): LoadingItemState<M> => {
    const data = selectTable(state);
    return findById(data, { id });
  };
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

interface LoadingMapActions<M = string> {
  loading: LoadingMapPayload<M>;
  success: LoadingMapPayload<M>;
  error: LoadingMapPayload<M>;
  remove: string[];
  resetById: string;
  resetAll: never;
}

export default function createLoaderTable({
  name,
  initialState = {},
  extraReducers,
}: SliceHelper<State<string>>) {
  const loading = loadingReducers<string>(defaultLoadingItem());
  const map = mapReducers(initialState);

  const slice = createSlice<State<string>, LoadingMapActions<string>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: {
      loading: reducerCreator<string>(loading.loading),
      success: reducerCreator<string>(loading.success),
      error: reducerCreator<string>(loading.error),
      resetById: (state: State<string>, id: string) => ({
        ...state,
        [id]: loading.reset(),
      }),
      remove: map.remove,
      resetAll: map.reset,
    },
  });

  return {
    ...slice,
    getSelectors: <S>(stateFn: (s: S) => State<string>) =>
      loaderTableSelectors(stateFn),
  };
}
