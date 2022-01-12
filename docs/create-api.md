# createApi

Control your data cache on the front-end.

Data fetching and caching using a robust middleware system.
Quickly build data loading within your redux application and reduce boilerplate.

**This API is undergoing active development. Consider this in a beta
state.**

- [Control your data cache](#control-your-data-cache)
- [Manipulating the request](#manipulating-the-request)
- [Simple cache](#simple-cache)
- [Dispatching many actions](#dispatching-many-actions)
- [Dependent queries](#dependent-queries)
- [Error handling](#error-handling)
- [Loading state](#loading-state)
- [React](#react)
- [Cache timer](#cache-timer)
- [Take leading](#take-leading)
- [Optimistic UI](#optimistic-ui)
- [Undo](#undo)

## Features

- Write middleware to handle fetching, synchronizing, and caching API requests
  on the front-end
- A familiar middleware system that node.js developers are familiar with
  (e.g. express)
- Simple recipes to handle complex use-cases like cancellation, polling,
  optimistic updates, loading states, undo, react
- Full control over the data fetching and caching layers in your application
- Fine tune selectors for your specific needs

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
  `/repos/neurosnap/robodux`,
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

## Why?

Libraries like [react-query](https://react-query.tanstack.com/),
[rtk-query](https://rtk-query-docs.netlify.app/), and
[apollo-client](https://www.apollographql.com/docs/react/) are making it
easier than ever to fetch and cache data from an API server.  All of them
have their unique attributes and I encourage everyone to check them out.

We wanted to take some of the great things from those libraries but provide a
little more control for the end-developer.  We also wanted to leverage a
powerful middleware paradigm that has been used for years in the expressjs world.

Why learn how to cache API data when a library can do it for you?  Here are
some reasons:

- What happens when [`useMemo` isn't good
  enough](https://medium.com/swlh/should-you-use-usememo-in-react-a-benchmarked-analysis-159faf6609b7)?
- What happens when the data syncing library lacks the caching granularity you
  need?
- What happens when the data syncing library doesn't cache things in an
  optimized way for your needs?
- What happens when you want to reuse your business logic for another platform
(e.g. a cli) and can't use `react`?

This library is intended for large scale, complex flow control applications
that need full control over the data cache layer while setting good standards
for using redux and a flexible middleware to handle all business logic.

## Core principles

- The end-developer should have full control over fetching/caching/querying
  their server data
- Fetching and caching data should be separate from the view layer
- Effects are the central processing unit for IO/business logic
- A minimal API that encourages end-developers to write code instead of
  configuring objects

## How does it work?

`createApi` will build a set of actions and async functions for each `action` or http
method used (e.g. `get`, `post`, `put`).  Let's call them endpoints.  Each
endpoint gets their own action and linked function.

The middleware that is loaded into the query via `.use(...)` gets added to an
array.  This array becomes a pipeline that each endpoint calls in order.  When
`await next()` is called inside the middleware or an endpoint, it calls the
next middleware in the stack until it finishes.  Everything after `await
next()` gets called after all the middleware ahead of the current middleware
finishes its execution.

Here's a test that demonstrates the order of execution:

```ts
test('middleware order of execution', async (t) => {
  t.plan(1);
  let acc = '';
  const api = createApi();
  api.use(api.actions());

  api.use(async (ctx, next) => {
    await delay(10);
    acc += 'b';
    await next();
    await delay(10);
    acc += 'f';
  });

  api.use(async (ctx, next) => {
    acc += 'c';
    awat next();
    acc += 'd';
    await delay(30);
    acc += 'e';
  });

  const action = api.create('/api', async (ctx, next) => {
    acc += 'a';
    await next();
    acc += 'g';
  });

  const store = setupStore();
  store.dispatch(action());

  await sleep(60);
  t.assert(acc === 'abcdefg');
});
```

## Control your data cache

```ts
import {
  createTable,
  createReducerMap,
  createApi,
  requestMonitor,
  requestParser,
  // FetchCtx is an interface that's built around using window.fetch
  // You don't have to use it if you don't want to.
  FetchCtx
} from 'robodux';

// create a reducer that acts like a SQL database table
// the keys are the id and the value is the record
const users = createTable<User>({ name: 'users' });

// something awesome happens in here
// The default generic value here is `ApiCtx` which includes a `payload`,
// `request`, and `response`.
// The generic passed to `createApi` must extend `ApiCtx` to be accepted.
const api = createApi<FetchCtx>();

// This middleware monitors the lifecycle of the request.  It needs to be
// loaded before `.routes()` because it needs to be around after everything
// else. It is composed of other middleware: dispatchActions and loadingMonitor.
// [dispatchActions]  This middleware leverages `redux-batched-actions` to
//  dispatch all the actions stored within `ctx.actions` which get added by
//  other middleware during the lifecycle of the request.
// [loadingMonitor] This middleware will monitor the lifecycle of a request and
//  attach the appropriate loading states to the loader associated with the
//  endpoint.
api.use(requestMonitor());

// This is where all the endpoints (e.g. `.get()`, `.put()`, etc.) you created
// get added to the middleware stack.  It is recommended to put this as close to
// the beginning of the stack so everything after `yield next()`
// happens at the end of the effect.
api.use(api.actions());

// This middleware is composed of other middleware: queryCtx, urlParser, and
// simpleCache
// [queryCtx] sets up the ctx object with `ctx.request` and `ctx.response`
//  required for `createApi` to function properly.
// [urlParser] is a middleware that will take the name of `api.create(name)` and
//  replace it with the values passed into the action.
// [simpleCache] is a middleware that will automatically store the response of
//  endpoints if the endpoint has `request.simpleCache = true`
api.use(requestParser());

// this is where you define your core fetching logic
api.use(async (ctx, next) => {
  // ctx.request is the object used to make a fetch request when using
  // `queryCtx` and `urlParser`
  const { url = '', ...options } = ctx.request;
  const resp = await fetch(`https://api.com${url}`, options);
  const data = await resp.json();

  // with `FetchCtx` we want to set the `ctx.response` so other middleware can
  // use it.
  ctx.response = { status: resp.status, ok: resp.ok, data };

  // we almost *always* need to call `await next()` that way other middleware will be
  // called downstream of this middleware. The only time we don't call `next`
  // is when we don't want to call any middleware after this one.
  await next();
});

// This is how you create a function that will fetch an API endpoint.  The
// first parameter is the name of the action type.  When using `urlParser` it
// will also be the URL inside `ctx.request.url` of which you can do what you
// want with it.
const fetchUsers = api.get(
  `/users`,
  // Since this middleware is first it has the unique benefit of being in full
  // control of when the other middleware get activated.
  // The type inside of `FetchCtx` is the response object
  async (ctx: FetchCtx<{ users: User[] }>, next) => {
    // anything before this call can mutate the `ctx` object before it gets
    // sent to the other middleware
    await next();
    // anything after the above line happens *after* the middleware gets called and
    // and a fetch has been made.

    // using FetchCtx `ctx.response` is a discriminated union based on the
    // boolean `ctx.response.ok`.
    if (!ctx.response.ok) return;

    // data = { users: User[] };
    const { data } = ctx.response;
    const curUsers = data.users.reduce<MapEntity<User>>((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});

    // save the data to our redux slice called `users`
    await ctx.actions.push(users.actions.add(curUsers));
  },
);

// This is a helper function, all id does is iterate through all the objects
// looking for a `.reducer` property and create a big object containing all
// the reducers which will then have `combineReducers` applied to it.
const reducers = createReducerMap(users);
// This is a helper function that does a bunch of stuff to prepare redux for
// robodux.  In particular, it will:
//   - Setup redux-batched-actions
//   - Setup a couple of reducers that robodux will use: loaders and data
const prepared = prepareStore({
  reducers,
});
const store = createStore(
  prepared.reducer,
  undefined,
  applyMiddleware(...prepared.middleware),
);

store.dispatch(fetchUsers());
```

## Recipes

### Manipulating the request

```ts
const createUser = api.post<{ id: string, email: string }>(
  `/users`,
  async (ctx: FetchCtx<User>, next) => {
    // here we manipulate the request before it gets sent to our middleware
    ctx.request = {
      body: JSON.stringify({ email: ctx.payload.email }),
    };
    await next();
    if (!ctx.response.ok) return;

    const curUser = ctx.response.data;
    const curUsers = { [curUser.id]: curUser };

    await ctx.actions.push(users.actions.add(curUsers));
  },
);

store.dispatch(createUser({ id: '1', }));
```

Have some `request` data that you want to set when creating the endpoint?

```ts
const fetchUsers = api.get('/users', api.request({ credentials: 'include' }))
```

`api.request()` accepts the request for the `Ctx` that the end-developer
provides.

### Simple cache

If you want to have a cache that doesn't enforce strict types and is more of a
dumb cache that fetches and stores data for you, then `simpleCache` will
provide that functionality for you.

The following code will mimic what a library like `react-query` is doing
behind-the-scenes.  I want to make it clear that `react-query` is doing a lot
more than this so I don't want to understate what it does.  However, you can
see that not only can we get a core chunk of the functionality `react-query`
provides with a little over 100 lines of code but we also have full control
over fetching, querying, and caching data with the ability to customize it
using middleware.

```ts
// api.ts
import {
  createApi,
  requestMonitor,
  requestParser,
  timer,
  prepareStore,
} from 'robodux';

const api = createApi();
api.use(requestMonitor());
api.use(api.routes());
api.use(requestParser());

// made up api fetch
api.use(apiFetch);

export const fetchUsers = api.get(
  '/users',
  // set `simpleCache=true` to have simpleCache middleware cache response data
  // automatically
  api.request({ simpleCache: true }),
);

const prepared = prepareStore();
const store = createStore(
  prepared.reducer,
  undefined,
  applyMiddleware(...prepared.middleware),
);
```

```tsx
// app.tsx
import React from 'react';
import { useQuery } from 'robodux';

import { fetchUsers } from './api';

interface User {
  id: string;
  name: string;
}

const useUsers = () => {
  const { data: users = [], ...loader } = useQuery<{ users: User[] }>(
    fetchUsers()
  );
  return { users, ...loader };
}

export const App = () => {
  const { users, isInitialLoading, isError, message } = useUsers();

  if (isInitialLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {message}</div>;

  return (
    <div>
      {users.map((user) => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

### Dispatching many actions

Sometimes we need to dispatch a bunch of actions for an endpoint.  From loading
states to making multiple requests in a single side-effect, there can be a lot of
actions being dispatched.  When using `prepareStore` we automatically setup
`redux-batched-actions` so you don't have to.  Anything that gets added to
`ctx.actions` will be automatically dispatched by the `dispatchActions`
middleware.

### Dependent queries

Sometimes it's necessary to compose multiple endpoints together.  For example
we might want to fetch a mailbox and its associated messages.  Similar to
`redux-thunk` you can await the dispatch. 

```ts
const fetchMailbox = api.get('/mailboxes');

const fetchMessages = api.get<{ id: string }>(
  '/mailboxes/:id/messages',
  async (ctx, next) => {
    // The return value of this is the entire `ctx` object.
    const mailCtx = await store.dispatch(fetchMailbox());

    if (!mailCtx.response.ok) {
      await next();
      return;
    }

    ctx.request = {
      url: `/mailboxes/${mailCtx.response.id}/messages`
    };

    await next();
  },
);
```

### Error handling

Error handling can be accomplished in a bunch of places in the middleware
pipeline.

Catch all middleware before itself:

```ts
const api = createApi();
api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('error!');
  }
});
api.use(api.routes());

api.use(() => {
  throw new Error('some error');
});

const action = api.create(`/error`);
const store = setupStore();
store.dispatch(action());
```

Catch middleware inside the action handler:

```ts
const api = createApi();
api.use(api.routes());
api.use(() => {
  throw new Error('some error');
});

const action = api.create(`/error`, async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('error!');
  }
});

const store = setupStore();
store.dispatch(action());
```

### Loading state

When using `prepareStore` in conjunction with `dispatchActions`,
`loadingMonitor`, and `requestParser` the loading state will automatically be
added to all of your endpoints.  We also export `QueryState` which is the
interface that contains all the state types that `robodux` provides.

```tsx
// app.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoaderById } from 'robodux';
import type { MapEntity, QueryState } from 'robodux';

import {
  fetchUsers,
  selectUsersAsList,
} from './api';

interface AppState extends QueryState {
  users: MapEntity<User>;
}

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsersAsList);
  const loader = useSelector(
    (s: AppState) => selectLoaderById(s, { id: `${fetchUsers}` })
  );
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  if (loader.isInitialLoading) {
    return <div>Loading ...</div>
  }

  if (loader.isError) {
    return <div>Error: {loader.message}</div>
  }

  return (
    <div>{users.map((user) => <div key={user.id}>{user.email}</div>)}</div>
  );
}
```

### React

We built a couple of simple hooks `useQuery` and `useSimpleCache` to make
interacting with `robodux` easier.  Having said that, it would be trivial to
build your own custom hooks to do exactly what you want.

Let's rewrite the react code used in the previous example ([loading
state](#loading-state))

```ts
// use-query.ts
import { useEffect } from 'react';
import { useQuery } from 'robodux/react';

import { fetchUsers, selectUsersAsList } from './api';

export const useQueryUsers = () => {
  const cache = useQuery(fetchUsers, selectUsersAsList);
  useEffect(() => {
    cache.trigger();
  }, []);
  return cache;
}
```

```tsx
// app.tsx
import React from 'react';
import { useQueryUsers } from './use-query';

const App = () => {
  const { data, isInitialLoading, isError, message } = useQueryUsers();

  if (isInitialLoading) {
    return <div>Loading ...</div>
  }

  if (isError) {
    return <div>Error: {message}</div>
  }

  return (
    <div>{data.map((user) => <div key={user.id}>{user.email}</div>)}</div>
  );
}
```

### Cache timer

Only call the endpoint at most once per interval.  We can dispatch the action
as many times as we want but it will only get activated once every N
milliseconds.  This effectively updates the cache on an interval.

```ts
import { timer } from 'robodux';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

const fetchUsers = api.get(
  '/users',
  [
    timer(10 * MINUTES), 
    async (ctx, next) => {
      // ...
      await next(); 
    },
  ]
);
```

### Take leading

If two requests are made:
- (A) request; then
- (B) request

While (A) request is still in flight, (B) request would be canceled.

```ts
import { takeLeading } from 'robodux';

const usersApi = api.create('/users');
const fetchUsers = usersApi.get([
  takeLeading,
  async (ctx, next) => {
    await next();
    // ...
  }
]);
```

### Optimistic UI

```tsx
import type { MapEntity, PatchEntity, OptimisticCtx } from 'robodux';
import { optimistic } from 'robodux';

const api = createApi();
api.use(api.actions());
api.use(optimistic);

const updateUser = api.patch(
  'update-user',
  async (ctx: OptimisticCtx<PatchEntity<User>, MapEntity<User>>, next) => {
    const { id, email } = ctx.payload;
    const prevUser = selectUserById(ctx.getState(), { id });

    ctx.optimistic = {
      apply: users.actions.patch({ [id]: { email } }),
      revert: users.actions.add({ [id]: prevUser }),
    };

    ctx.request = {
      method: 'PATCH',
      body: JSON.stringify({ email }),
    };

    await next();
  }
);
```

### Undo

We build a simple undo middleware that waits for one of two actions to be
dispatched:

- doIt() which will call the endpoint
- undo() which will cancel the endpoint

The middleware accepts three properties:

- `doItType` (default: `${doIt}`) => action type
- `undoType` (default: `${undo}`) => action type
- `timeout` (default: 30 * 1000) => time in milliseconds before the endpoint
  get canceled automatically

```ts
import {
  createApi,
  requestMonitor,
  requestParser,
  undoer,
  undo,
  doIt,
  UndoCtx,
  createAction
} from 'robodux';

interface Message {
  id: string;
  archived: boolean;
}

const messages = createTable<Message>({ name: 'messages' });
const api = createApi<UndoCtx>();
api.use(requestMonitor());
api.use(api.actions());
api.use(requestParser());
api.use(undoer());

const archiveMessage = api.patch<{ id: string; }>(
  `message/:id`,
  async (ctx, next) => {
    ctx.undoable = true;

    // prepare the request
    ctx.request = {
      body: JSON.stringify({ archived: true }),
    };

    // make the API request
    await next();
  }
)

const reducers = createReducerMap(messages);
const store = setupStore(reducers);

store.dispatch(archiveMessage({ id: '1' }));
// wait 2 seconds to cancel endpoint
store.dispatch(undo());
// -or- to activate the endpoint
store.dispatch(doIt());
```
