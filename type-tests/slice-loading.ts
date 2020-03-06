import loadingSlice from '../src/slice-loading';

const one = loadingSlice({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<Partial<{ message: string; timestamp: number; }>, string>; success: (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => Action<...>; reset:...
one.actions;
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<Partial<{ message: string; timestamp: number; }>, string>
one.actions.loading;
one.actions.loading();
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<Partial<{ message: string; timestamp: number; }>, string>
one.actions.success;
one.actions.success();
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<Partial<{ message: string; timestamp: number; }>, string>
one.actions.error;
one.actions.error();
// $ExpectType Reducer<LoadingItemState<string>, Action<any, string>>
one.reducer;

const withPayload = loadingSlice({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<Partial<{ message: string; timestamp: number; }>, string>; success: (payload?: Partial<{ message: string; timestamp: number; }> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => Action<...>; reset:...
withPayload.actions;
withPayload.actions.loading({ message: 'hi' });
withPayload.actions.success({ message: 'nice' });
withPayload.actions.error({ message: 'hi' });
// $ExpectType Reducer<LoadingItemState<string>, Action<any, string>>
withPayload.reducer;

const two = loadingSlice<string | Error>({
  name: 'SLICE',
  initialState: {
    message: '',
    error: false,
    success: false,
    loading: false,
    lastRun: 0,
    lastSuccess: 0,
  },
});
two.actions;
two.actions.error({ message: new Error('wow') });
two.actions.loading({ message: 'loading' });
// $ExpectType Reducer<LoadingItemState<string | Error>, Action<any, string>>
two.reducer;
