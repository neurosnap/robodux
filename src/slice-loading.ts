import createSlice from './slice';
import { ActionsAny } from './types';

export interface LoadingItemState {
  error: string;
  loading: boolean;
  success: boolean;
  message: string;
}

export const defaultLoadingItem = () => ({
  error: '',
  message: '',
  loading: false,
  success: false,
});

interface LoadingActions {
  success: string;
  error: string;
  loading: string;
  reset: never;
}

export default function loadingSlice({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: {
  name: string;
  initialState?: LoadingItemState;
  extraReducers?: ActionsAny;
}) {
  return createSlice<LoadingItemState, LoadingActions>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducts: {
      success: (state: LoadingItemState, payload) => ({
        error: '',
        message: payload || '',
        loading: false,
        success: true,
      }),
      error: (state: LoadingItemState, payload) => ({
        error: payload || '',
        message: '',
        loading: false,
        success: false,
      }),
      loading: (state: LoadingItemState, payload) => ({
        error: '',
        message: payload || '',
        loading: true,
        success: false,
      }),
      reset: () => initialState,
    },
  });
}
