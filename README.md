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

const { actions, reducer } = robodux({
  slice: 'counter',
  initialState: 0,
  actions: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload,
  },
});

const reducer = combineReducers({
  counter: counter.reducer,
});

const store = createStore(reducer);

store.dispatch(actions.increment());
// -> { counter: 1 }
store.dispatch(actions.increment());
// -> { counter: 1 }
store.dispatch(actions.multiply(3));
// -> { counter: 6 }
```
