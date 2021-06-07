import createLoader from '../src/create-loader';

const one = createLoader({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ message: string; timestamp: number; meta: Record<string, any>; }> | undefined) => Action<Partial<{ message: string; timestamp: number; meta: Record<string, any>; }>, string>; success: (payload?: Partial<...> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => A...
one.actions;
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; meta: Record<string, any>; }> | undefined) => Action<Partial<{ message: string; timestamp: number; meta: Record<string, any>; }>, string>
one.actions.loading;
one.actions.loading();
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; meta: Record<string, any>; }> | undefined) => Action<Partial<{ message: string; timestamp: number; meta: Record<string, any>; }>, string>
one.actions.success;
one.actions.success();
// $ExpectType (payload?: Partial<{ message: string; timestamp: number; meta: Record<string, any>; }> | undefined) => Action<Partial<{ message: string; timestamp: number; meta: Record<string, any>; }>, string>
one.actions.error;
one.actions.error();
// $ExpectType Reducer<LoadingItemState<Record<string, any>>, Action<any, string>>
one.reducer;

const withPayload = createLoader({ name: 'SLICE' });
// $ExpectType { loading: (payload?: Partial<{ message: string; timestamp: number; meta: Record<string, any>; }> | undefined) => Action<Partial<{ message: string; timestamp: number; meta: Record<string, any>; }>, string>; success: (payload?: Partial<...> | undefined) => Action<...>; error: (payload?: Partial<...> | undefined) => A...
withPayload.actions;
withPayload.actions.loading({ message: 'hi' });
withPayload.actions.success({ message: 'nice' });
withPayload.actions.error({ message: 'hi' });
// $ExpectType Reducer<LoadingItemState<Record<string, any>>, Action<any, string>>
withPayload.reducer;

const two = createLoader({
  name: 'SLICE',
  initialState: {
    message: '',
    status: 'idle' as 'idle',
    lastRun: 0,
    lastSuccess: 0,
    meta: {},
  },
});
two.actions;
two.actions.error({ message: 'wow' });
two.actions.loading({ message: 'loading' });
// $ExpectType Reducer<LoadingItemState<{}>, Action<any, string>>
two.reducer;
