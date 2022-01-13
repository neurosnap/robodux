# robodux

[![ci](https://github.com/neurosnap/robodux/actions/workflows/ci.yml/badge.svg)](https://github.com/neurosnap/robodux/actions/workflows/ci.yml)

- [Documentation](./docs/index.md)
- [Example repo](https://github.com/neurosnap/listifi)
- [Style guide](https://erock.io/2020/01/01/redux-saga-style-guide.html)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it. By using the
`robodux` pattern the amount of redux boilerplate is dramatically reduced. In
most cases, wiring up action types, action creators, and reducers can be done in
one line of code.

## Features

- Create actions, reducer, and selectors for common data structures
- Automates the boring parts of redux
- Dramatically reduces redux boilerplate
- Works well with [saga-query](https://github.com/neurosnap/saga-query)

## What's included

- [createTable](./docs/basic-concepts.md#createtable): Thinking of reducers as
  database tables, this function builds actions, reducer, and selectors that
  builds simple and repeatable operations for that table.
- [createAssign](./docs/basic-concepts.md#createassign): A catch-all data
  structure that makes it easy to set or reset the reducer.
- [createList](./docs/basic-concepts.md#createlist): Store an array of items in
  a slice
- [createLoaderTable](./docs/basic-concepts#createloadertable): Store as many
  independent loaders in this reducer which are all accessible by an `id`.
- [createSlice](./docs/api.md#createslice): Core function that the above slice
  helpers leverage. Build action types, action creators, and reducer pairs with
  one simple function.
- [and more!](./docs/api.md)

## Core principles

The overriding principle is that effects (like sagas) should be the central
processing unit for all business logic in a react/redux application. We should
remove as much business logic as possible from reducers and instead centralize
them inside of our side-effect handlers.

The other primary principle is to think of redux as a database and reducers as
tables. This simplifies the action/reducer logic and makes it possible to build
reuseable components which dramatically reducers boilerplate.

Please see [style-guide](https://erock.io/redux-saga-style-guide) for more
details.

## Getting started

```bash
yarn add robodux
```

If you don't already have `redux`, and `reselect` installed, you'll need to
install those as well as they're peer dependencies.

```bash
yarn add redux reselect
```

### Usage

The primary philosophical change between this library and other libraries is to
think of your redux store as a database.

Reducers are database tables and operating on those tables should have a
consistent API for managing them.

`robodux` has a few slice helpers that cover ~90% of the logic and data
structures needed to build and scale your state.

These are one-line functions that create action types, action creators, and
reducers using a simple set of lower-level functions. There's no magic here,
it's more of how we think about our state that has made it dramatically simple
to automate repetitive tasks in redux.

One of the more useful APIs from this library is `createTable`. This slice
helper creates a reducer and a set of actions that make it easy to treat a slice
as a database table.

```ts
import { combineReducers, createStore } from 'redux';
import { createTable, createReducerMap, MapEntity } from 'robodux';

// setup reducer state
interface Comment {
  message: string;
  timestamp: number;
}

interface State {
  comments: MapEntity<Comment>;
}

// create reducer and actions
const comments = createTable<Comment>({ name: 'comments' });

// converts multiple slices into an object of reducers to be used with combineReducers
// { comments: (state, action) => state }
const reducers = createReducerMap(comments);
const rootReducer = combineReducers(reducers);
const store = createStore(rootReducer);

// dispatch action to add a record to our table
store.dispatch(
  actions.add({
    1: { message: 'you awake?', timestamp: 1577117359 },
  }),
);
// { comments: { 1: { message: 'you awake?', timestamp: 1577117359 } } }

store.dispatch(
  actions.patch({
    1: { message: 'Are you awake?' },
  }),
);
// { comments: { 1: { message: 'Are you awake?', timestamp: 1577117359 } } }

const selectors = comments.getSelectors((state) => state[comments.name]);

const state = store.getState();
const commentMap = selectors.selectTable(state);
const commentList = selectors.selectTableAsList(state);
const commentOne = selectors.selectById(state, { id: '1' });
const foundComments = selectors.selectByIds(state, { ids: ['1', '3'] });
```

## References

- [saga-query](https://github.com/neurosnap/saga-query)
