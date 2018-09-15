# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it.  `robodux` attempts
to simplify the boilerplate by automatically configuring actions, reducers, and
selectors.  The way it works is `robodux` will take a list of functions that
correspond to how state should be updated and then create action types, action
creators, and basic selectors for the developer to use.  This library tries to
not make too many assumptions about how developers use redux.  It does not
do anything magical, simply automates the repetitive tasks with redux.

Also, all reducers created by `robodux` does not send the state object to reducers,
but a draft of the state that can be mutated directly.

## Features

* Automatically creates actions, reducer, and selector based on `slice`
* Reducers leverage `immer` that makes updating state easy
* When stringifying action creators they return the action type
* Helper functions for manually creating actions and reducers

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
  slice: 'counter', // slice is optional could be blank ''
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
  slice: 'user', // slice is optional could be blank ''
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
const state = store.getState();
console.log(user.selectors.getUser(state));
// -> { name: 'eric' }
console.log(counter.selectors.getCounter(state));
// -> 6
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
