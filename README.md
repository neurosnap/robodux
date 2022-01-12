# robodux

A powerful middleware and caching library for redux side-effects.

[![ci](https://github.com/neurosnap/robodux/actions/workflows/ci.yml/badge.svg)](https://github.com/neurosnap/robodux/actions/workflows/ci.yml)

- [Documentation](./docs/index.md)

Handling side-effects in any codebase is non-trivial, this is especially true
for front-end apps. React provides the ability to handle side-effects with
hooks but there is a cost associated with leveraging hooks for data fetching
and caching: it collapses all layers within a front-end app into the react
component lifecycle.

`robodux` provides a robust middleware system for your side-effects.  It takes
express-like middleware and applies it to the front-end application ecosystem.

`robodux` also provides a set of helpers to build reducers, actions, and
selectors automatically based on the type of data the user needs.  By treating
the redux store as a database, we can remove a significant amount of
boilerplate.

```ts
import { createPipe, delay } from 'robodux';

const thunks = createPipe();
thunks.use(async (ctx, next) => {
  console.log('before thunk');
  await next();
  console.log('after thunk');
});
thunks.use(thunks.actions());

const makeItSo = thunks.create('make-it-so', async (ctx, next) => {
  console.log('thunk start');
  await delay(500);  
  console.log('thunk end');
  await next();
});

store.dispatch(makeItSo());
// before thunk
// thunk start
// thunk end
// after thunk
```

## Features

- Express-like middleware system for your thunks
- Data fetching and caching for react applications
- Create actions, reducer, and selectors for common data structures
- Dramatically reduces redux boilerplate

## What's included

- [createPipe](./docs/create-pipe.md): robust middleware system for
  side-effects
- [createApi](./docs/create-api.md): data fetching function leveraging a robust
  middleware system for side-effects
- [createTable](./docs/basic-concepts.md#createtable): Thinking of reducers as
  database tables, this function builds actions, reducer, and selectors that
  builds simple and repeatable operations for that table.
- [createAssign](./docs/basic-concepts.md#createassign): A catch-all data
  structure that makes it easy to set or reset the reducer.
- [createList](./docs/basic-concepts.md#createlist): Store an array of items in
  a slice
- [createSlice](./docs/api.md#createslice): Core function that the above slice
  helpers use. Build action types, action creators, and reducer pairs with
  one simple function.
- [and more!](./docs/api.md)

## Core principles

The overriding principle is that effects should be the central
processing unit for all business logic in a react/redux application. We should
remove as much business logic as possible from reducers and instead centralize
them inside of our side-effect handlers.

The other primary principle is to think of redux as a database and reducers as
tables. This simplifies the action/reducer logic and makes it possible to build
reuseable components which dramatically reduces boilerplate.

This is in contrast to the official redux recommendations. Please see 
[style-guide](https://erock.io/redux-saga-style-guide) for more
details.

## Getting started

```bash
yarn add robodux
```

If you don't already have `redux` and `reselect` installed, you'll
need to install those as well as they're peer dependencies.

```bash
yarn add redux reselect
```

If you want to use the react-hooks for `createApi` then you also need to
install

```bash
yarn add react react-dom react-redux
```

## Usage

```ts
// api.ts
import { createApi, requestMonitor, requestParser } from 'robodux';

const api = createApi();
api.use(requestMonitor());
// where all the routes get placed in the middleware stack
api.use(api.actions()); 
api.use(requestParser());

api.use(async (ctx, next) => {
  const { url = "", ...options } = ctx.request;
  const resp = await fetch(`https://api.github.com${url}`, options);
  const data = await resp.json();
  ctx.response = { status: resp.status, ok: resp.ok, data };
  await next(); // call all middleware after this one
});

export const fetchRepo = api.get(
  `/repos/neurosnap/saga-query`,
  api.request({ simpleCache: true })
);
```

```tsx
// app.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSimpleCache } from 'robodux';
import { fetchUsers } from './api';

const App = () => {
  const cache = useSimpleCache(fetchUsers());

  useEffect(() => {
    cache.trigger();
  }, []);

  if (cache.isInitialLoading) return <div>Loading ...</div>
  if (cache.isError) return <div>{cache.message}</div>

  return (
    <div>
      {cache.data.map((user) => <div key={user.id}>{user.email}</div>)}
    </div>
  );
}
```

## Docs

- [Documentation](./docs/index.md)
