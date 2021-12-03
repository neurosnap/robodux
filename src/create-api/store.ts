import type { Reducer, Middleware } from 'redux';
import {
  combineReducers,
  createStore as createReduxStore,
  applyMiddleware,
} from 'redux';
import { enableBatching } from 'redux-batched-actions';

import type { QueryState } from './slice';
import { reducers as roboduxReducers } from './slice';
import { createMiddleware } from './middleware';

export interface PrepareStore<
  S extends { [key: string]: any } = { [key: string]: any },
> {
  reducer: Reducer<S & QueryState>;
  middleware: Middleware<any, S, any>[];
}

interface Props<S extends { [key: string]: any } = { [key: string]: any }> {
  reducers: { [key in keyof S]: Reducer<S[key]> };
}

/**
 * prepareStore will setup redux-batched-actions to work with robodux.
 * It will also add some reducers to your redux store for decoupled loaders
 * and a simple data cache.
 *
 * const { middleware, reducer } = prepareStore({
 *  reducers: { users: (state, action) => state },
 * });
 * const store = createStore(reducer, {}, applyMiddleware(...middleware));
 */
export function prepareStore<
  S extends { [key: string]: any } = { [key: string]: any },
>({ reducers = {} as any }: Props<S>): PrepareStore<S> {
  const middleware: Middleware<any, S, any>[] = [];

  const roboduxMiddleware = createMiddleware();
  middleware.push(roboduxMiddleware);

  const reducer = combineReducers({ ...roboduxReducers, ...reducers });
  const rootReducer: any = enableBatching(reducer);

  return { middleware, reducer: rootReducer };
}

export function setupStore(reducers: { [key: string]: Reducer } = {}) {
  const prepared = prepareStore({
    reducers,
  });
  const store: any = createReduxStore(
    prepared.reducer,
    applyMiddleware(...prepared.middleware),
  );
  return store;
}
