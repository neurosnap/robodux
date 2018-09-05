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
* stringifying actions returns action types for `redux-saga` support
* removing dependency on `lodash`

## Usage

```js
import robodux from 'robodux';
import { createStore, combineReducers } from 'redux';

const counter = robodux({
  slice: 'counter',
  initialState: 0,
  actions: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload,
  },
});

const user = robodux({
  slice: 'user',
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
