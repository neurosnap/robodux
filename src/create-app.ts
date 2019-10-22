import { combineReducers, ReducersMapObject, AnyAction } from 'redux';

export default function createApp<S = any>(
  mds: { reducers?: ReducersMapObject<S, AnyAction> }[],
) {
  const reducer = combineReducers<S>(
    mds.reduce(
      (acc, mod) => {
        if (!mod.reducers) {
          return acc;
        }

        Object.keys(mod.reducers).forEach((key) => {
          if (!mod.reducers) {
            return acc;
          }

          acc[key as keyof S] = mod.reducers[key as keyof S];
        });

        return acc;
      },
      {} as ReducersMapObject<S, AnyAction>,
    ),
  );

  return {
    reducer,
  };
}
