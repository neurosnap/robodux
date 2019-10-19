import { combineReducers } from 'redux';

interface ReducerMap {
  [key: string]: any;
}

export default function createApp(mds: { reducers: ReducerMap }[]) {
  const reducer = combineReducers(
    mds.reduce<ReducerMap>((acc, mod) => {
      Object.keys(mod.reducers).forEach((key) => {
        acc[key] = mod.reducers[key];
      });

      return acc;
    }, {}),
  );

  return {
    reducer,
  };
}
