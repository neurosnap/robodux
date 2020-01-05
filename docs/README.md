[![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

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

```ts
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

## Basic concepts

### How to use slice helpers

If we think of the redux store as a database then a reducer can be thought of as
a table. The most similar data structure to a table is a json object where the
keys are ids and the values are json objects. We have created a slice helper
that creates some very common actions that manage that table.

#### mapSlice

```ts
import { mapSlice } from 'robodux';

interface SliceState {
  [key: string]: { name: string, email: string };
}

const name = 'test';
const { reducer, actions } = mapSlice<SliceState>({ name });
const state = {
  3: { name: 'three', email: 'three@three.com' }
};

store.dispatch(
  actions.add({
    1: { name: 'one', email: 'one@one.com' },
    2: { name: 'two', email: 'two@two.com' },
  })
);
/* {
  1: { name: 'one', email: 'one@one.com' },
  2: { name: 'two', email: 'two@two.com' },
  3: { name: 'three', email: 'three@three.com' },
} */

store.dispatch(
  actions.set({
    4: { name: 'four', email: 'four@four.com' },
    5: { name: 'five', email: 'five@five.com' },
    6: { name: 'six': email: 'six@six.com' },
  })
)
/* {
  4: { name: 'four', email: 'four@four.com' },
  5: { name: 'five', email: 'five@five.com' },
  6: { name: 'six': email: 'six@six.com' },
} */

store.dispatch(
  actions.remove(['5', '6'])
)
/* {
  4: { name: 'four', email: 'four@four.com' },
} */

// only update a part of the entity
store.dispatch(
  actions.patch({
    4: { name: 'five' }
  })
)
/* {
  4: { name: 'five', email: 'four@four.com' },
} */

store.dispatch(
  actions.reset()
)
// {}
```

#### assignSlice

These are common operations when dealing with a slice that simply needs to be
set or reset. You can think of this slice helper as a basic setter. I regularly
use this for things like setting a token in my app or if I'm prototyping and I
just need something quick.

```ts
import { assignSlice } from 'robodux';

type SliceState = string;

const name = 'token';
const { reducer, actions } =
  assignSlice < SliceState > { name, initialState: '' };

store.dispatch(actions.set('some-token'));
/* redux state: { token: 'some-token' } */

store.dispatch(actions.set('another-token'));
/* redux state: { token: 'another-token' } */

store.dispatch(actions.reset());
// redux state: { token: '' }
```

#### loadingSlice

Helper slice that will handle loading data

```js
import { loadingSlice, LoadingItemState } from 'robodux';

const { actions, reducer } = loadingSlice({ name: 'loading' });
store.dispatch(actions.loading('something loading'));
// redux state: { loading: { error: '', message: 'something loading', loading: true, success: false } }

store.dispatch(actions.success('great success'));
// redux state: { loading: { error: '', message: 'great success', loading: false, success: true } }

store.dispatch(actions.error('something happened'));
// redux state: { loading: { error: 'something happened', loading: false, success: false } }
```

_NOTE_: We do **not** use `immer` for any slice helpers. Since they are highly
reusable pieces of code, we are comfortable properly handling reducer logic
without the performance overhead of `immer`.

### Typescript

Properly typing redux state is very valuable to a developer. That's why we spend
a lot of time trying to get the types as good as possible for this library.

For anyone using this library we are committed to improving the types and
welcome any contributions on that front.

### Extra reducers

By default `createSlice` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.

```ts
const user = createSlice<User, UserActions>({
  name: 'user',
  initialState: { name: '', address: '' },
  reducts: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  },
  extraReducers: {
    setAddress: (state, payload) => {
      state.address = payload;
    }
  }
})

store.dispatch({ type: 'setAddress', payload: '1337 tsukemen rd' });
store.getState();
// { name: '', address: '1337 tsukemen rd' }
```

### How to use createSlice

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
import { createSlice } from 'robodux';
import { createStore, combineReducers, Action } from 'redux';

interface CounterActions {
  increment: never;  // <- indicates no payload expected
  decrement: never;
  multiply: number;  // <- indicates a payload of type number is required
}

const counter = createSlice<number, CounterActions>({
  name: 'counter', // action types created by robodux will be prefixed with slice, e.g. { type: 'counter/increment' }
  initialState: 0,
  reducts: { // reducts = reducer + actions (stupid, I know)
    increment: (state) => state + 1,  // state is type cast as a number from the supplied slice state type
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload,  // payload here is type cast as number as from CounterActions
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
  reducts: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  }
})

const reducer = combineReducers({
  counter: counter.reducer,
  user: user.reducer,
});

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

### Types

#### without explicit types

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
  reducts: {
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
  reducts: {
    setTest: (state, payload) => { state.test = payload }, // payload is type string from Actions
    setWow: (state, payload) => {state.wow = payload }, // payload is type number from Actions
    reset: (state) => defaultState,
  },
});

actions.setTest('ok'); // autocomplete and type checking for payload(string), type error if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), type error if called without payload
actions.reset(); // type checks to ensure action is called without params
```

## Advanced concepts

### Building a slice helper

Let's say we want to store a data structure that is a hash map where the key
is the `id` and the value is a list of ids.  We want to add some extra operations
to this functionality to be able to remove ids from a single list and merge two lists together.

```ts
import { mapReducers, SliceHelper, createSlice } from 'robodux';

// specify actions like any other usage of `createSlice`
interface ListMapSlice<S> {
  add: S;
  set: S;
  remove: string[];
  removeItems: string[];
  reset: never;
  merge: S;
}

export default function listMapSlice<
  State extends { [name: string]: string[] }
>({
  name,
  initialState = {} as State,
  extraReducers,
}: SliceHelper<State>) {
  // here we are reusing reducers created for mapSlice
  const { add, set, remove, reset } = mapReducers(initialState);

  return createSlice<State, ListMapSlice<State>>({
    name,
    initialState,
    extraReducers,
    // we don't need immer for these reducers
    useImmer: false,
    reducts: {
      add,
      set,
      remove,
      reset,
      // we would like to be able to remove elements from a list inside a map
      removeItems: (state: State, payload: string[]) => {
        const newState = { ...state };
        Object.keys(newState).forEach((key: keyof State) => {
          const list = [...newState[key]];
          (newState as any)[key] = list.filter(
            (item) => !payload.includes(item),
          );
        });
        return newState;
      },
      // we would like to merge two lists together inside a map
      merge: (state: State, payload: State) => {
        const newState = { ...state };
        Object.keys(payload).forEach((key) => {
          const k: keyof State = key;
          const curState = newState[k] || [];
          const rmDupes = new Set([...curState, ...payload[key]]);
          (newState as any)[k] = [...rmDupes];
        });
        return newState;
      },
    },
  });
}
```
