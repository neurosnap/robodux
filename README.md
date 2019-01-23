# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it.  `robodux` attempts
to simplify the boilerplate by automatically configuring actions, reducers, and
selectors.  The way it works is `robodux` will take a list of functions that
correspond to how state should be updated and then create action types, action
creators, and basic selectors for the developer to use.  This library tries to
not make too many assumptions about how developers use redux.  It does not
do anything magical, simply automates the repetitive tasks with redux.

Under the hood every reducer created by `robodux` leverages
[immer](https://github.com/mweststrate/immer) to update the store,
which means reducers are allowed to mutate the state directly.

## Features

* Automatically creates actions, reducer, and selector based on `slice`
* Reducers leverage `immer` which makes updating state easy
* When stringifying action creators they return the action type
* Helper functions for manually creating actions and reducers
* Reducers do no receive entire action object, only payload
* Slice helpers to further reduce repetitive reducer types (map slice, assign slice)

## Why not X?

This library was heavily inspired by [autodux](https://github.com/ericelliott/autodux) and [redux-starter-kit](https://github.com/markerikson/redux-starter-kit).
The reason why I decided to create a separate library was primarily for:

* typescript support
* creating reducers with `immer`
* no external dependencies besides `immer`
* create action helper
* create reducer helper

## Usage

```js
import robodux from 'robodux';
import { createStore, combineReducers, Action } from 'redux';

interface User {
  name: string;
}

interface State {
  user: User;
  counter: number;
}

interface CounterActions {
  increment: never;  // <- indicates no payload expected
  decrement: never;
  multiply: number;  // <- indicates a payload of type number is required
}

const counter = robodux<number, CounterActions, State>({
  slice: 'counter', // slice is optional could be blank '' or left out completely
  initialState: 0,
  actions: {
    increment: (state) => state + 1,  // state is type cast as a number from the supplied slicestate type
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload,  // payload here is type cast as number as from CounterActions
  },
});

interface UserActions {
  setUserName: string;
}

const user = robodux<User, UserActions, State>({
  slice: 'user', // slice is optional could be blank ''
  initialState: { name: '' },
  actions: {
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
console.log(user.selectors.getUser(state));
// -> { name: 'eric' }
console.log(counter.selectors.getCounter(state));
// -> 6
```

Without immer:

```js
const user = robodux<User, UserActions, State>({
  slice: 'user', // slice is optional could be blank ''
  initialState: { name: '' },
  actions: {
    setUserName: (state, payload) => {
      return { ...state, name: payload }
    },
  },
  useImmer: false,
})


```

## Types

`robodux` accepts three generics: `SliceState`, `Actions`, `State`.

`SliceState` is the state shape of the particular slice created with `robodux`.  If there is no
slice passed to the state, then this will assume that this is the entire state shape.

`Actions` helps improve autocompelete and typing for the `actions` object returned from `robodux`.
Supply an interface where they keys are the action names and the values are the payload types, which should be `never` if the action takes no payload.

`State` is the entire state shape for when a slice is used with `robodux`.  This helps type the selectors we
return which requires the entire state as the parameter and not simply the slice state.

```js
import robodux from 'robodux';
import { Action } from 'redux';

interface SliceState {
  test: string;
  wow: number;
}

interface State {
  hi: SliceState;
  other: boolean;
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

const { actions, selectors, reducer } = robodux<SliceState, Actions, State>({
  slice: 'hi',
  initialState: defaultState,
  actions: {
    setTest: (state, payload) => { state.test = payload }, // payload is type string from Actions
    setWow: (state, payload) => {state.wow = payload }, // payload is type number from Actions
    reset: (state) => defaultState,
  },
});

const val = selectors.getSlice({ hi: defaultState, other: true }); // typechecks param as State
actions.setTest('ok'); // autocomplete and type checking for payload(string), typeerror if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), typeerror if called without payload
actions.reset(); // typechecks to ensure action is called without params

```

### Usage without explicit types

Robodux can be used without supplying interfaces, it will instead infer the types for you

```js
import robodux from 'robodux';
import { Action } from 'redux';

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux({
  slice: 'hi',
  initialState: defaultState,
  actions: { // state type is inferred from initial state
    setTest: (state, payload: string) => { state.test = payload }, // payload is typecast as string
    setWow: (state, payload: number) => {state.wow = payload }, // payload is typecast as number
    reset: (state, payload: never) => defaultState,
  },
});

const val = selectors.getSlice({ hi: defaultState, other: true }); // typechecks param has `hi` key
actions.setTest('ok'); // autocomplete and type checking for payload(string), typeerror if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), typeerror if called without payload
actions.reset(); // typechecks to ensure action is called without params
```

## Slice Helpers

There are some common slices that I find myself creating over and over again.
These helpers will further help reduce the amount of repetitive code written for
redux.

### map slice (v1.2.0)

These are common operations when dealing with a slice that is a hash map.

```js
import { mapSlice } from 'robodux';

interface SliceState {
  [key: string]: string;
}
interface State {
  test: SliceState
}

interface Actions {
  addTest: State;
  setTest: State;
  removeTest: string[];
  resetTest: never;
}

const slice = 'test';
const { reducer, actions } = mapSlice<SliceState, Actions, State>(slice);
const state = { 3: 'three' };

store.dispatch(
  actions.addTest({
    1: 'one',
    2: 'two',
  })
);
/* {
  1: 'one',
  2: 'two',
  3: 'three,
} */

store.dispatch(
  actions.setTest({ 4: 'four', 5: 'five', 6: 'six' })
)
/* {
  4: 'four',
  5: 'five',
  6: 'six',
} */

store.dispatch(
  actions.removeTest(['5', '6'])
)
/* {
  4: 'four'
} */

store.dispatch(
  actions.resetTest()
)
// {}

```

### assign slice (v2.1.0)

These are common operations when dealing with a slice that simply needs to be set or reset

```js
import { assignSlice } from 'robodux';

type SliceState = string;

interface Actions {
  setTest: SliceState;
  resetTest: never;
}

interface State {
  test: SliceState;
}

const slice = 'token';
const { reducer, actions } = assignSlice<SliceState, Actions, State>({ slice, initialState: '' });

store.dispatch(
  actions.setToken('some-token')
);
/* redux state: { token: 'some-token' } */

store.dispatch(
  actions.setToken('another-token')
)
/* redux state: { token: 'another-token' } */

store.dispatch(
  actions.resetTest()
)
// redux state: { token: '' }

```

## API

### robodux

This is the default export for robodux and will automatically create actions, reducer, and selectors
for you.

### createAction

This is the helper function that `robodux` uses to create an action.  It is also useful to use
when not using robodux because when stringifying the function it will return the action type.
This allows developers to not have to worry about passing around action types, instead they simply
pass around action creators for reducers, sagas, etc.

```js
import { createAction } from 'robodux';

const increment = createAction<number, 'INCREMENT'>('INCREMENT');
console.log(increment);
// -> 'INCREMENT'
console.log(increment(2));
// { type: 'INCREMENT', payload: 2 };
const detailType = 'STORE_DETAILS';
const storeDetails = createAction<{ name: string, surname: string }, typeof detailType>(detailType);
console.log(storeDetails);
// -> 'STORE_DETAILS'
console.log(storeDetails({name: 'John', surname: 'Doe'}));
// { type: 'INCREMENT', payload: {name: 'John', surname: 'Doe'} };
```

### createReducer

This is the helper function that `robodux` uses to create a reducer.  This function maps action types
to reducer functions.  It will return a reducer.

```js
import { createReducer } from 'robodux';

const counter = createReducer({
  initialState: 0,
  actions: {
    INCREMENT: (state) => state + 1,
    DECREMENT: (state) => state - 1,
    MULTIPLY: (state, payload) => state * payload,
  }
});

console.log(counter(2, { type: 'MULTIPLY': payload: 5 }));
// -> 10
```

Without `immer`

```js
import { createReducer } from 'robodux';

const counter = createReducer({
  initialState: 0,
  actions: {
    INCREMENT: (state) => state + 1,
    DECREMENT: (state) => state - 1,
    MULTIPLY: (state, payload) => state * payload,
  },
  useImmer: false,
});

console.log(counter(2, { type: 'MULTIPLY': payload: 5 }));
// -> 10
```

### mapSlice

See slice helpers for more info

### assignSlice

See slice helpers for more info
