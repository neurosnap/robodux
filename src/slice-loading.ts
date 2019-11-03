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
  success: string | undefined;
  error: string | undefined;
  loading: string | undefined;
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
      success: (state: LoadingItemState, payload: string | undefined) => ({
        error: '',
        message: payload || '',
        loading: false,
        success: true,
      }),
      error: (state: LoadingItemState, payload: string | undefined) => ({
        error: payload || '',
        message: '',
        loading: false,
        success: false,
      }),
      loading: (state: LoadingItemState, payload: string | undefined) => ({
        error: '',
        message: payload || '',
        loading: true,
        success: false,
      }),
      reset: (state: LoadingItemState) => initialState,
    },
  });
}
