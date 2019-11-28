import loadingSlice from '../src/slice-loading';

const one = loadingSlice({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<Partial<{ error: string; message: string; }>>; success: (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => Action<...>; reset: () => Action<...>; }
one.actions;
// $ExpectType (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<Partial<{ error: string; message: string; }>>
one.actions.loading;
one.actions.loading();
// $ExpectType (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<Partial<{ error: string; message: string; }>>
one.actions.success;
one.actions.success();
// $ExpectType (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<Partial<{ error: string; message: string; }>>
one.actions.error;
one.actions.error();
// $ExpectType Reducer<LoadingItemState<string, string>, Action<any>>
one.reducer;

const withPayload = loadingSlice({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<Partial<{ error: string; message: string; }>>; success: (payload?: Partial<{ error: string; message: string; }> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => Action<...>; reset: () => Action<...>; }
withPayload.actions;
withPayload.actions.loading({ message: 'hi' });
withPayload.actions.success({ error: 'nice' });
withPayload.actions.error({ message: 'hi', error: 'nice' });
// $ExpectType Reducer<LoadingItemState<string, string>, Action<any>>
withPayload.reducer;

const two = loadingSlice<string, Error | null>({
  name: 'SLICE',
  initialState: {
    message: '',
    error: null,
    success: false,
    loading: false,
  },
});
// $ExpectType { loading: (payload?: Partial<{ error: Error | null; message: string; }> | undefined) => Action<Partial<{ error: Error | null; message: string; }>>; success: (payload?: Partial<{ error: Error | null; message: string; }> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => Action<...>; reset: (...
two.actions;
// two.actions.success({ message: 'ok', error: 'sdsd' });
two.actions.error({ message: 'ok', error: new Error('sdsd') });
two.actions.loading({ error: new Error('sdsd') });
// $ExpectType Reducer<LoadingItemState<string, Error | null>, Action<any>>
two.reducer;
