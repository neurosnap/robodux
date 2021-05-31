# Basic Concepts

- [createTable](#createtable)
- [createMap](#createmap)
- [createList](#createlist)
- [createAssign](#createassign)
- [createLoader](#createloader)
- [createLoaderTable](#createloadertable)
- [createReducerMap](#createreducermap)
- [createApp](#createapp)
- [extraReducers](#extrareducers)
- [How to use createSlice](#how-to-use-createslice)
- [Typescript Types](#typescript-types)

## How to use slice helpers

If we think of the redux store as a database then a reducer can be thought of as
a table. The most similar data structure to a table is a json object where the
keys are ids and the values are json objects. We have created a slice helper
that creates some very common actions and selectors that manage that table.

_NOTE_: We do **not** use `immer` for any slice helpers. Since they are highly
reusable pieces of code, we are comfortable properly handling reducer logic
without the performance overhead of `immer`

### createTable

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

### createMap

This has the same actions as `createTable` but doesn't have to adhere to the 
value being a json object.

```ts
import { createMap } from 'robodux';

const { reducer, actions } = createMap<{ [key: string]: string }>({ name: 'text' });
store.dispatch(actions.add({ 1: 'some text' }));
/*
{
  text: {
    1: 'some text'
  }
}
*/
```

### createList

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

### createAssign

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

### createLoader

Helper slice that will handle loading data.  The main idea here is that we want 
to decouple data from UI and since loaders are primarily used to display loaders 
in the UI, they should be separated.

This has a unique benefit to where we can create loaders for any data as well 
as any combination of fetches.

`createLoader` creates a global loader that can be used as a single loader.

```ts
import { createLoader, LoadingItemState } from 'robodux';

const { actions, reducer } = createLoader({ name: 'loading' });
store.dispatch(actions.loading('something loading'));
// timestamps as unix timestamps
/*
{
  loading: {
    error: false, message: 'something loading', loading: true, success: false, lastRun: 111111111, lastSuccess: 0
  }
}
*/

store.dispatch(actions.success('great success'));
/*
{
  loading: {
    error: false, message: 'great success', loading: false, success: true, lastRun: 111111111, lastSuccess: 22222222
  }
}
*/

store.dispatch(actions.error('something happened'));
/*
{
  loading: {
    error: 'something happened', loading: false, success: false, lastRun: 111111111, lastSuccess: 22222222
  }
}
*/
```

### createLoaderTable

This is a table of loaders so we can build an infinite number of loaders for our app keyed by the id.

```ts
const { createLoaderTable } from 'robodux';

const { actions, reducer } = createLoaderTable({ name: 'loaders' });
store.dispatch(actions.loading({ id: 'users', message: 'fetching users ...' }));
/*
{
  loaders: {
    users: {
      error: false, message: 'fetching users ...', loading: true, success: false, lastRun: 11111111, lastSuccess: 0
    }
  }
}
*/

store.dispatch(actions.success({ id: 'users' }));
/*
{
  loaders: {
    users: {
      error: false, message: 'fetching users ...', loading: false, success: true, lastRun: 11111111, lastSuccess: 22222222
    }
  }
}
*/

store.dispatch(actions.error({ id: 'users', message: 'something happened' }));
/*
{
  loaders: {
    users: {
      error: true, message: 'something happened', loading: false, success: false, lastRun: 11111111, lastSuccess: 22222222
    }
  }
}
*/

store.dispatch(actions.loading({ id: 'posts' }));
/*
{
  loaders: {
    users: {
      error: true, message: 'something happened', loading: false, success: false, lastRun: 11111111, lastSuccess: 22222222
    },
    posts: {
      error: false, message: '', loading: true, success: false, lastRun: 33333333, lastSuccess: 0
    }
  }
}
*/
```

## createReducerMap

TODO

## createApp

TODO

## Extra reducers

By default `createSlice` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.

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

## How to use createSlice

Think of a slice as a single reducer.

_NOTE_: By default, this library uses [immer](https://github.com/immerjs/immer)
for its reducers. I highly recommend anyone using this library to understand how
it works and its performance ramifications.

```ts
const rootReducer = combineReducers({
  token: (state, payload) => payload, // this is a slice
  users: (state, payload) => payload, // this is a slice
  userSelected: (state, payload) => payload, // this is a slice
  comments: (state, payload) => payload, // this is a slice
});
// aside: you should always configure your store as flat as possible
// think of the store as a database where the slice is a table
```

This function helps build a slice for your application. It will create action
types, action creators, and reducers.

```ts
import { createSlice, createReducerMap } from 'robodux';
import { createStore, combineReducers, Action } from 'redux';

interface CounterActions {
  increment: never; // <- indicates no payload expected
  decrement: never;
  multiply: number; // <- indicates a payload of type number is required
}

const counter = createSlice<number, CounterActions>({
  name: 'counter', // action types created by robodux will be prefixed with slice, e.g. { type: 'counter/increment' }
  initialState: 0,
  reducers: {
    // reducers = reducer + actions (stupid, I know)
    increment: (state) => state + 1, // state is type cast as a number from the supplied slice state type
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload, // payload here is type cast as number as from CounterActions
  },
});

interface User {
  name: string;
}

interface UserActions {
  setUserName: string;
}

const user = createSlice<UserActions, User>({
  name: 'user', // slice is optional could be blank ''
  initialState: { name: '' },
  reducers: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  },
});

const reducers = createReducerMap(user, counter);
const reducer = combineReducers(reducers);
const store = createStore(reducer);

store.dispatch(counter.actions.increment());
// New State -> { counter: 1, user: { name: '' } }
store.dispatch(counter.actions.increment());
// New State -> { counter: 2, user: { name: '' } }
store.dispatch(counter.actions.multiply(3));
// New State -> { counter: 6, user: { name: '' } }
console.log(`${counter.actions.decrement}`);
// -> counter/decrement
store.dispatch(user.actions.setUserName('eric'));
// New State -> { counter: 6, user: { name: 'eric' } }
const state = store.getState();
console.log(state[users.name]);
// -> { name: 'eric' }
console.log(state[counter.name]);
// -> 6
```

## Typescript Types

### without explicit types

`createSlice` can be used without supplying interfaces, it will instead infer
the types for you

```ts
import { createSlice } from 'robodux';
import { Action } from 'redux';

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = createSlice({
  name: 'hi',
  initialState: defaultState,
  reducers: {
    // state type is inferred from initial state
    setTest: (state, payload: string) => {
      state.test = payload;
    }, // payload is typecast as string
    setWow: (state, payload: number) => {
      state.wow = payload;
    }, // payload is typecast as number
    reset: (state, payload: never) => defaultState,
  },
});

actions.setTest('ok'); // autocomplete and type checking for payload(string), type error if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), type error if called without payload
actions.reset(); // type checks to ensure action is called without params
```

`createSlice` accepts two generics: `Actions` and `SliceState`.

`Actions` helps improve auto-complete and typing for the `actions` object
returned from `robodux`. Supply an interface where they keys are the action
names and the values are the payload types, which should be `never` if the
action takes no payload.

`SliceState` is the state shape of the particular slice created with
`createSlice`. If there is no slice passed to the state, then this will assume
that this is the entire state shape.

```ts
import { createSlice } from 'robodux';
import { Action } from 'redux';

interface SliceState {
  test: string;
  wow: number;
}

interface Actions {
  setTest: string;
  setWow: number;
  reset: never;
}

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = createSlice<SliceState, Actions>({
  name: 'hi',
  initialState: defaultState,
  reducers: {
    setTest: (state, payload) => {
      state.test = payload;
    }, // payload is type string from Actions
    setWow: (state, payload) => {
      state.wow = payload;
    }, // payload is type number from Actions
    reset: (state) => defaultState,
  },
});

actions.setTest('ok'); // autocomplete and type checking for payload(string), type error if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), type error if called without payload
actions.reset(); // type checks to ensure action is called without params
```
