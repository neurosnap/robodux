# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

- [Getting started](README.md#getting-started)
- [Basic Concepts](./basics/README.md)
  - [Using a slice helper](./basics/use-slice-helpers.md)
  - [Extra reducers](./basics/extra-reducers.md)
  - [Typescript](./basics/typescript.md)
  - [Using createSlice](./basics/use-create-slice.md)
- [Advanced Concepts](./advanced/README.md)
  - [Building a slice helper](./advanced/build-slice-helper.md)
- [API](api.md)
- [Style guide](style-guide.md)
- [FAQ](faq.md)

## Getting started

```bash
yarn add robodux
```

_NOTE_: we officially support Typescript.

The primary philosophical change between this library and other libraries is to
think of your redux store as a database.

Reducers are database tables (or indexes) and operating on those tables should
have a consistent API for managing them.

`robodux` has created three slice helpers that cover ~90% of the logic and data
structures needed to build and scale your state.

These are one-line functions that create action types, action creators, and
reducers using a simple set of lower-level functions. There's no magic here,
it's more of how we think about our state that has made it dramatically simple
to automate repetitive tasks in redux.

```js
import { mapSlice } from 'robodux';

// setup reducer state
interface Comment = {
  message: string;
  timestamp: number;
}
// `mapSlice` deals with a hashmap structure
// normally this means the key should be an id and the value is the entity
interface CommentState = { [key: string]: Comment };

// create reducer and actions
const { actions, reducer } = mapSlice<CommentState>({ name: 'counter' });

// dispatch some actions to manage the reducer state
dispatch(
  actions.addComment({
    1: { message: 'you awake?', timestamp: 1577117359 }
  })
);
```

See the [Using slice helpers](./basics/use-slice-helpers.md) to learn more.

## Style guide

`robodux` also provides a [style guide](style-guide.md) on how to
build large scale applications using this library.
