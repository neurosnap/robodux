import { combineReducers, ReducersMapObject, Reducer } from 'redux';

export default function createApp<S = any>(
  mds: { reducers: { [key: string]: Reducer } }[],
) {
  const reducer = combineReducers<S>(
    mds.reduce((acc, mod) => {
      if (!mod.reducers) {
        return acc;
      }

      Object.keys(mod.reducers).forEach((key) => {
        if (!mod.reducers) {
          return;
        }

        const reducer: Reducer | undefined = mod.reducers[key];
        if (reducer) {
          acc[key as keyof S] = reducer;
        }
      });

      return acc;
    }, {} as ReducersMapObject<S>),
  );

  return {
    reducer,
  };
}
