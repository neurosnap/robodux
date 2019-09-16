import createSlice from './slice';
import { AnyState, ActionsAny } from './types';

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

const error = (state: LoadingItemState, error: string): LoadingItemState => ({
  error,
  message: '',
  loading: false,
  success: false,
});

const success = (
  state: LoadingItemState,
  message?: string,
): LoadingItemState => ({
  error: '',
  message: message || '',
  loading: false,
  success: true,
});

const loading = (
  state: LoadingItemState,
  message?: string,
): LoadingItemState => ({
  error: '',
  message: message || '',
  loading: true,
  success: false,
});

export default function createLoadingSlice<
  A extends ActionsAny = any,
  S extends AnyState = AnyState
>({ name, extraReducers }: { name: keyof S; extraReducers?: ActionsAny }) {
  const initialState = defaultLoadingItem();
  return createSlice<LoadingItemState, A, S>({
    name,
    useImmer: false,
    initialState,
    reducts: {
      [`${name}Error`]: error,
      [`${name}Success`]: success,
      [name]: loading,
      [`${name}Reset`]: (state: LoadingItemState) => initialState,
    } as any,
    extraReducers,
  });
}
