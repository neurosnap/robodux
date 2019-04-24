import robodux from './slice';
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
>({ slice, extraActions }: { slice: keyof S; extraActions?: ActionsAny }) {
  const initialState = defaultLoadingItem();
  return robodux<LoadingItemState, A, S>({
    slice,
    initialState,
    actions: {
      [`${slice}Error`]: error,
      [`${slice}Success`]: success,
      [slice]: loading,
      [`${slice}Reset`]: (state: LoadingItemState) => initialState,
    } as any,
    extraActions,
  });
}
