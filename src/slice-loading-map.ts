import createSlice from './create-slice';
import { SliceHelper } from './types';
import { mapReducers } from './slice-map';
import {
  LoadingItemState,
  LoadingPayload,
  loadingReducers,
  defaultLoadingItem,
} from './slice-loading';

interface State<M, E> {
  [key: string]: LoadingItemState<M, E>;
}

export type LoadingMapPayload<M, E> = LoadingPayload<M, E> & { id: string };

function reducerCreator<M, E>(
  reducer: (
    s: LoadingItemState<M, E>,
    p: LoadingPayload<M, E>,
  ) => LoadingItemState<M, E>,
) {
  return (state: State<M, E>, payload: LoadingMapPayload<M, E>) => ({
    ...state,
    [payload.id]: reducer(state[payload.id], payload),
  });
}

interface LoadingMapActions<M = string, E = string> {
  loading: LoadingMapPayload<M, E>;
  success: LoadingMapPayload<M, E>;
  error: LoadingMapPayload<M, E>;
  remove: string[];
  resetById: string;
  resetAll: never;
}

export default function loadingSliceMap({
  name,
  initialState = {},
  extraReducers,
}: SliceHelper<State<string, string>>) {
  const loading = loadingReducers<string, string>(defaultLoadingItem());
  const map = mapReducers(initialState);

  return createSlice<State<string, string>, LoadingMapActions<string, string>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: {
      loading: reducerCreator<string, string>(loading.loading),
      success: reducerCreator<string, string>(loading.success),
      error: reducerCreator<string, string>(loading.error),
      resetById: (state: State<string, string>, id: string) => ({
        ...state,
        [id]: loading.reset(),
      }),
      remove: map.remove,
      resetAll: map.reset,
    },
  });
}
