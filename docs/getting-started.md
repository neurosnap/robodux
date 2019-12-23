# Getting started

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

See the [Using slice helpers](/docs/basics/use-slice-helpers.md) to learn more.

`robodux` also tries to provide a [style guide](/docs/style-guide.md) on how to
build large scale applications using this library.
