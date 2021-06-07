# Basic Concepts

- [createTable](#createtable)
- [createAssign](#createassign)
- [createList](#createlist)
- [createLoaderTable](#createloadertable)
- [createReducerMap](#createreducermap)
- [createApp](#createapp)
- [extraReducers](#extrareducers)

## How to use slice helpers

If we think of the redux store as a database then a reducer can be thought of as
a table. The most similar data structure to a table is a json object where the
keys are ids and the values are json objects. We have created a slice helper
that creates some very common actions and selectors that manage that table.

_NOTE_: We do **not** use `immer` for any slice helpers. Since they are highly
reusable pieces of code, we are comfortable properly handling reducer logic
without the performance overhead of `immer`

## createTable

This is probably the most useful slice helper provided by `robodux`.  It
creates a redux slice that acts like a database table.  The key is the id of
the record and the value is the record itself.  You are responsible for
setting the object up as `robodux` has no way to know what the record id is.
We could have created a function that you provide that tells us what the `id`
is but we made the design decision to keep this API interface simple. 

```ts
import { createTable } from 'robodux';

interface User {
  name: string;
  email: string;
  posts: string[];
}

const name = 'users';
const { reducer, actions, getSelectors } = createTable<User>({ name });
const state = {
  3: { name: 'three', email: 'three@three.com', posts: ['1'] }
};

store.dispatch(
  actions.add({
    1: { name: 'one', email: 'one@one.com', posts: [] },
    2: { name: 'two', email: 'two@two.com', posts: [] },
  })
);
/* {
  1: { name: 'one', email: 'one@one.com', posts: [] },
  2: { name: 'two', email: 'two@two.com', posts: [] },
  3: { name: 'three', email: 'three@three.com', posts: ['1'] },
} */

store.dispatch(
  actions.set({
    4: { name: 'four', email: 'four@four.com', posts: ['3'] },
    5: { name: 'five', email: 'five@five.com', posts: [] },
    6: { name: 'six': email: 'six@six.com', posts: [] },
  })
)
/* {
  4: { name: 'four', email: 'four@four.com', posts: ['3'] },
  5: { name: 'five', email: 'five@five.com', posts: [] },
  6: { name: 'six': email: 'six@six.com', posts: [] },
} */

store.dispatch(
  actions.remove(['5', '6'])
)
/* {
  4: { name: 'four', email: 'four@four.com', posts: ['3'] },
} */

// only update a part of the entity
store.dispatch(
  actions.patch({
    4: { name: 'five' }
  })
)
/* {
  4: { name: 'five', email: 'four@four.com', posts: ['3'] },
} */

// patch + 1-level merging of objects and arrays within the record
store.dispatch(
  actions.merge({
    4: { posts: ['5', '6'] }
  })
);
/* {
  4: { name: 'five', email: 'four@four.com', posts: ['3', '5', '6'] },
} */

store.dispatch(
  actions.reset()
)
// {}

const state = store.getState();
const selectors = getSelectors((state) => state.user);
// returns the entire slice of data
const users = selectors.selectTable(state);
// returns all slice data as an array
const userList = selectors.selectTableAsList(state);
// will return the record at the id specified or undefined if it is not found
const userOne = selectors.selectById(state, { id: '1' });
const defaultUser: User = {
  name: '',
  email: '',
}
const createEntitySelector = mustSelectEntity(defaultUser);
const selectById = createEntitySelector(selectors.selectById);
// must return User even if one isn't found
const userSix = selectors.selectById(state, { id: '6' });
// get users by list of ids
const usersById = selectors.selectByIds(state, { ids: ['1', '6'] });
```

## createAssign

These are common operations when dealing with a slice that simply needs to be
set or reset. You can think of this slice helper as a basic setter. I regularly
use this for simple types like strings or if I'm prototyping and I
just need something quick.

```ts
import { createAssign } from 'robodux';

const name = 'token';
const { reducer, actions } = createAssign<string>({
  name,
  initialState: '',
});

store.dispatch(actions.set('some-token'));
/* redux state: { token: 'some-token' } */

store.dispatch(actions.set('another-token'));
/* redux state: { token: 'another-token' } */

store.dispatch(actions.reset());
// redux state: { token: '' }
```

## createList

This is an array data structure where it's easy to manage a simple array.

```ts
import { createList } from 'robodux';

const { reducer, actions } = createList({ name: 'userIds' });
store.dispatch(actions.add(['1', '2']));
/*
{
  userIds: ['1', '2']
}
*/

store.dispatch(actions.add(['3']));
/*
{
  userIds: ['1', '2', '3']
}
*/

store.dispatch(actions.remove(['1', '2']));
/*
{
  userIds: ['3']
}
*/

store.dispatch(actions.reset());
/*
{
  userIds: []
}
*/
```

## createLoaderTable

This is a table of loaders so we can build an infinite number of loaders for 
our app keyed by the id.

```ts
const { createLoaderTable } from 'robodux';

const loaders = createLoaderTable({ name: 'loaders' });
const { actions, reducer } = loaders;
const { selectById: selectLoaderById } = loaders.getSelectors(
  (s: State) => loaders.name
);

store.dispatch(
  actions.loading({ id: 'users', message: 'fetching users ...' })
);
/*
{
  loaders: {
    users: {
      status: 'loading',
      message: 'fetching users ...',
      lastRun: 11111111, 
      lastSuccess: 0
    }
  }
}
*/

store.dispatch(actions.success({ id: 'users' }));
/*
{
  loaders: {
    users: {
      status: 'success',
      message: 'fetching users ...', 
      lastRun: 11111111, 
      lastSuccess: 22222222
    }
  }
}
*/

store.dispatch(actions.error({ id: 'users', message: 'something happened' }));
/*
{
  loaders: {
    users: {
      status: 'error',
      message: 'something happened',
      lastRun: 11111111, 
      lastSuccess: 22222222
    }
  }
}
*/

store.dispatch(actions.loading({ id: 'posts' }));
/*
{
  loaders: {
    users: {
      status: 'error',
      message: 'something happened', 
      lastRun: 11111111, 
      lastSuccess: 22222222
    },
    posts: {
      status: 'loading',
      message: '',
      lastRun: 33333333, 
      lastSuccess: 0
    }
  }
}
*/
```

The selectors returned from `getSelectors` will embellish the
`LoadingItemState` with some extra derived values that can help with the logic
of loading data in the view layer:

```ts
selectLoaderById(store.getState(), { id: 'posts' });
/*
{
  status: 'loading',
  message: '',
  lastRun: 33333333, 
  lastSuccess: 0,
  isInitialLoading: false,
  isLoading: true,
  isError: false,
  isSuccess: false,
  isIdle: false,
}
*/
```

The values are derived by:

`isIdle` => `status === 'idle'`
`isLoading` => `status === 'loading'`
`isError` => `status === 'error'`
`isSuccess` => `status === 'success'`
`isInitialLoading` => `status === 'loading' && lastRun === 0`

## createReducerMap

This is a very useful function that will convert a list of slices into an
object of reducers where the key is the name of the slice and the value is the
reducer itself.  This allows us to compose slices together and prepare it for
`combineReducers`.

```ts
import { combineReducers } from 'redux';
import { createTable, createAssign, createReducerMap } from 'robodux';

const users = createTable({ name: 'users' });
const threads = createTable({ name: 'threads' });
const comments = createTable({ name: 'comments' });
const token = createAssign({ name: 'token', initialState: '' });

const reducers = createReducerMap(users, threads, comments, token);
/*
{
  users: Reducer,
  threads: Reducer,
  comments: Reducer,
  token: Reducer,
}
*/
const roorReducer = combineReducers(reducers);
```

## createApp

If we are [following the `robodux` modular
pattern](https://erock.io/2020/01/01/redux-saga-style-guide.html#the-robodux-pattern)
then when we are building our slices they live within their own modules.  Each
module exports a variable `reducers` which contains all the reducers created
within the module.  When we want to build our root reducer, we need a way to
combine all the module reducers into one reducer.  `createApp` helps combine
all the reducers from all modules into a single reducer.

```ts
import { createStore } from 'redux';
import { createApp } from 'robodux';

import * as users from '@app/users';
import * as threads from '@app/threads';
import * as comments from '@app/comments';
import * as token from '@app/token';

const { reducer } = createApp([users, threads, comments, tokens]);
const store = createStore(reducer);
```

## extraReducers

By default `createSlice` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.  All slice helpers also accept `extraReducers` which will be passed
through to `createSlice`.

```ts
const user = createSlice<User, UserActions>({
  name: 'user',
  initialState: { name: '', address: '' },
  reducers: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  },
  extraReducers: {
    setAddress: (state, payload) => {
      state.address = payload;
    },
  },
});

store.dispatch({ type: 'setAddress', payload: '1337 tsukemen rd' });
store.getState();
// { name: '', address: '1337 tsukemen rd' }
```

All of our slice helpers also accept `extraReducers`.
