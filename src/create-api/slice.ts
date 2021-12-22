import createTable from '../create-table';
import createLoaderTable from '../create-loader-table';
import type { LoadingItemState } from '../create-loader';
import { createReducerMap } from '../combine';

export interface QueryState {
  '@@robodux/loaders': { [key: string]: LoadingItemState };
  '@@robodux/data': { [key: string]: any };
}

export const LOADERS_NAME = `@@robodux/loaders`;
export const loaders = createLoaderTable({ name: LOADERS_NAME });
export const {
  loading: setLoaderStart,
  error: setLoaderError,
  success: setLoaderSuccess,
  resetById: resetLoaderById,
} = loaders.actions;
export const { selectTable: selectLoaders, selectById: selectLoaderById } =
  loaders.getSelectors((state: any) => state[LOADERS_NAME] || {});

export const DATA_NAME = `@@robodux/data`;
export const data = createTable<any>({ name: DATA_NAME });
export const { selectTable: selectData, selectById: selectDataById } =
  data.getSelectors((s: any) => s[DATA_NAME] || {});
export const { add: addData, reset: resetData } = data.actions;

export const reducers = createReducerMap(loaders, data);

export const createQueryState = (s: Partial<QueryState> = {}): QueryState => {
  return {
    [LOADERS_NAME]: {},
    [DATA_NAME]: {},
    ...s,
  };
};
