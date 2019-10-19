import { combineReducers } from 'redux';

interface ReducerMap {
  [key: string]: any;
}

export default function createApp(mds: { reducers?: ReducerMap }[]) {
  const reducer = combineReducers(
    mds.reduce<ReducerMap>((acc, mod) => {
      if (!mod.reducers) {
        return acc;
      }

      Object.keys(mod.reducers).forEach((key) => {
        if (!mod.reducers) {
          return acc;
        }

        acc[key] = mod.reducers[key];
      });

      return acc;
    }, {}),
  );

  return {
    reducer,
  };
}
