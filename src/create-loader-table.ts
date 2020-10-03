import createSlice from './create-slice';
import { SliceHelper } from './types';
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

  return createSlice<State<string>, LoadingMapActions<string>>({
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
}
