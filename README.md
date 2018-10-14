# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it.  `robodux` attempts
to simplify the boilerplate by automatically configuring actions, reducers, and
selectors.  The way it works is `robodux` will take a list of functions that
correspond to how state should be updated and then create action types, action
creators, and basic selectors for the developer to use.  This library tries to
not make too many assumptions about how developers use redux.  It does not
do anything magical, simply automates the repetitive tasks with redux.

Under the hood every reducer created by `robodux` leverages [immer](https://github.com/mweststrate/immer) to update the store,
which means reducers are allowed to mutate the state directly.

## Features

* Automatically creates actions, reducer, and selector based on `slice`
* Reducers leverage `immer` which makes updating state easy
* When stringifying action creators they return the action type
* Helper functions for manually creating actions and reducers
* Reducers do no receive entire action object, only payload

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
  increment: (payload: number) => Action;
  decrement: (payload: number) => Action;
  multiply: (payload: number) => Action;
}

const counter = robodux<number, CounterActions, State>({
  slice: 'counter', // slice is optional could be blank ''
  initialState: 0,
  actions: {
    increment: (state: number) => state + 1,
    decrement: (state: number) => state - 1,
    multiply: (state: number, payload: number) => state * payload,
  },
});

interface UserActions {
  setUserName: (payload: string) => Action;
}

const user = robodux<User, UserActions, State>({
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

## Types

`robodux` accepts three generics: `SliceState`, `Actions`, `State`.

`SliceState` is the state shape of the particular slice created with `robodux`.  If there is no
slice passed to the state, then this will assume that this is the entire state shape.

`Actions` helps improve autocompelete and typing for the `actions` object returned from `robodux`.
Supply an interface where they keys are the action names and the values are the functions that return actions.

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
  set: (payload: SliceState) => Action;
  reset: () => Action;
}

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux<SliceState, Actions, State>({
  slice: 'hi',
  actions: {
    set: (state: SliceState, payload: SliceState) => payload,
    reset: () => defaultState,
  },
  initialState: defaultState,
});

const val = selectors.getHi({ hi: defaultState, other: true }); // assumes param is State
actions.set({ test: 'ok', wow: 0 }); // autocomplete and type helping for payload
actions.reset();
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
