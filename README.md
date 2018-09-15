# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

## Features

* Automatically creates actions and reducer based on `slice`
* Reducers leverage `immer` that makes updating state easy
* When stringifying action creators they return the action type

## Why not X?

This library was heavily inspired by [autodux](https://github.com/ericelliott/autodux).
The reason why I decided to create a separate library was primarily for:

* typescript support
* creating reducers with `immer`
* removing dependency on `lodash`
* create action helper
* create reducer helper

## Usage

```js
import robodux from 'robodux';
import { createStore, combineReducers } from 'redux';

const counter = robodux<number>({
  slice: 'counter',
  initialState: 0,
  actions: {
    increment: (state: number) => state + 1,
    decrement: (state: number) => state - 1,
    multiply: (state: number, payload: number) => state * payload,
  },
});

interface User {
  name: string;
}

const user = robodux<User>({
  slice: 'user',
  initialState: { name: '' },
  actions: {
    setUserName: (state: User, payload: string) => {
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
// -> { counter: 1, user: {} }
store.dispatch(counter.actions.increment());
// -> { counter: 1, user: {} }
store.dispatch(counter.actions.multiply(3));
// -> { counter: 6, user: {} }
console.log(`${counter.actions.decrement}`);
// -> counter/decrement
store.dispatch(user.actions.setUserName('eric'));
// -> { counter: 6, user: { name: 'eric' } }
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

const increment = createAction('INCREMENT');
console.log(increment);
// -> 'INCREMENT'
console.log(increment(2));
// { type: 'INCREMENT', payload: 2 };
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
