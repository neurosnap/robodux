# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it. `robodux` attempts to
simplify the boilerplate by automatically configuring actions, reducers, and
selectors. The way it works is `robodux` will take a list of functions that
correspond to how state should be updated and then create action types, action
creators, and basic selectors for the developer to use. This library tries to
not make too many assumptions about how developers use redux. It does not do
anything magical, simply automates the repetitive tasks with redux.

Under the hood every reducer created by `robodux` leverages
[immer](https://github.com/mweststrate/immer) to update the store, which means
reducers are allowed to mutate the state directly.

## Features

- Automatically creates actions, reducer, and selector based on `slice`
- Action types are prefixed with `slice`
- Reducers leverage `immer` which makes updating state easy
- When stringifying action creators they return the action type
- Helper functions for manually creating actions and reducers
- Reducers do no receive entire action object, only payload
- Slice helpers to further reduce repetitive reducer types (map slice, assign
  slice, loading slice)

## Why not X?

This library was heavily inspired by
[autodux](https://github.com/ericelliott/autodux) and
[redux-starter-kit](https://github.com/markerikson/redux-starter-kit). The
reason why I decided to create a separate library was primarily for:

- typescript support
- creating reducers with `immer`
- no external dependencies besides `immer`
- create action helper
- create reducer helper
- slice helpers

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
  name: 'counter', // action types created by robodux will be prefixed with slice, e.g. { type: 'countr/increment' }
  initialState: 0,
  reducts: {
    increment: (state) => state + 1,  // state is type cast as a number from the supplied slicestate type
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload,  // payload here is type cast as number as from CounterActions
  },
});

interface UserActions {
  setUserName: string;
}

const user = robodux<User, UserActions, State>({
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

### without explicit types

Robodux can be used without supplying interfaces, it will instead infer the
types for you

```js
import robodux from 'robodux';
import { Action } from 'redux';

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux({
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

actions.setTest('ok'); // autocomplete and type checking for payload(string), typeerror if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), typeerror if called without payload
actions.reset(); // typechecks to ensure action is called without params
```

### extraReducers (v5.0)

By default `robodux` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.

```js
const user = robodux<User, UserActions, State>({
  name: 'user',
  initialState: { name: '' },
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
```

## Creating a module

The recommended way to use this library is by creating a module. A module is a
composition of slices.

```js
// counter.js
import { createSlice, createActionMap, createReducerMap } from 'robodux';

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducts: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  }
});

const counterLoader = createSlice({
  name: 'counterLoader',
  initialState: false,
  reducts: {
    loading: (state, payload: boolean) => payload,
  };
})

const selectors = {
  getCounter = (state) => state[counter.name],
  getCounterLoader = (state) => state[counterLoader.name],
};

const actions = createActionMap(counter, counterLoader);
const reducers = createReducerMap(counter, counterLoader);

// creating a consistent API is very important for maintainability
// so all modules should export the same API
export { selectors, actions, reducers };
```

All of my apps are setup in a similar way. An app is a composition of modules
and the UI. To read more about why apps should be set up this way then read my
blog article: https://erock.io/scaling-js-codebase-multiple-platforms/

## Types

`robodux` accepts three generics: `SliceState`, `Actions`, `State`.

`SliceState` is the state shape of the particular slice created with `robodux`.
If there is no slice passed to the state, then this will assume that this is the
entire state shape.

`Actions` helps improve autocompelete and typing for the `actions` object
returned from `robodux`. Supply an interface where they keys are the action
names and the values are the payload types, which should be `never` if the
action takes no payload.

`State` is the entire state shape for when a slice is used with `robodux`. This
helps type the selectors we return which requires the entire state as the
parameter and not simply the slice state.

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
  name: 'hi',
  initialState: defaultState,
  reducts: {
    setTest: (state, payload) => { state.test = payload }, // payload is type string from Actions
    setWow: (state, payload) => {state.wow = payload }, // payload is type number from Actions
    reset: (state) => defaultState,
  },
});

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

params: { name, extraReducers }

```js
import { mapSlice, PatchEntity } from 'robodux';

interface SliceState {
  [key: string]: { name: string, email: string };
}
interface State {
  test: SliceState
}

// NOTE: you only need to type the actions you are going to use
interface Actions {
  addTest: State;
  setTest: State;
  removeTest: string[];
  resetTest: never;
  patchTest: PatchEntity<State>;
}

const name = 'test';
const { reducer, actions } = mapSlice<SliceState, Actions, State>({ name });
const state = {
  3: { name: 'three', email: 'three@three.com' }
};

store.dispatch(
  actions.addTest({
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
  actions.setTest({
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
  actions.removeTest(['5', '6'])
)
/* {
  4: { name: 'four', email: 'four@four.com' },
} */

// only update a part of the entity
store.dispatch(
  actions.patchTest({
    4: { name: 'five' }
  })
)
/* {
  4: { name: 'five', email: 'four@four.com' },
} */

store.dispatch(
  actions.resetTest()
)
// {}
```

### assign slice (v2.1.0)

These are common operations when dealing with a slice that simply needs to be
set or reset

params: { name, initialState, extraReducers }

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

const name = 'token';
const { reducer, actions } = assignSlice<SliceState, Actions, State>({ name, initialState: '' });

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

### loading slice (v3.0)

Helper slice that will handle loading data

params: { name, extraReducers }

```js
import { loadingSlice, LoadingItemState } from 'robodux';

interface Actions {
  loading: string;
  loadingSuccess: string;
  loadingError: string;
}

interface State {
  loading: LoadingItemState;
}

const { actions, reducer } = loadingSlice<Actions, State>({ name: 'loading' });
store.dispatch(
  actions.loading('something loading')
)
// redux state: { loading: { error: '', message: 'something loading', loading: true, success: false } }

store.dispatch(
  actions.loadingSuccess('great success')
)
// redux state: { loading: { error: '', message: 'great success', loading: false, success: true } }

store.dispatch(
  actions.loadingError('something happened')
)
// redux state: { loading: { error: 'something happened', loading: false, success: false } }
```

## API

### robodux

This is the default export for robodux and will automatically create actions,
reducer, and selectors for you.

```
{
  name: string, // required
  useImmer: boolean, // default, true, determines whether or not to use immer
  initialState: any, // the initial state for the reducer
  reducts: object, // the action to reducer map
}
```

### createAction

This is the helper function that `robodux` uses to create an action. It is also
useful to use when not using robodux because when stringifying the function it
will return the action type. This allows developers to not have to worry about
passing around action types, instead they simply pass around action creators for
reducers, sagas, etc.

```js
import { createAction } from 'robodux';

const increment = createAction('INCREMENT');
console.log(increment);
// -> 'INCREMENT'
console.log(increment(2));
// { type: 'INCREMENT', payload: 2 };
const storeDetails = createAction('STORE_DETAILS');
console.log(storeDetails);
// -> 'STORE_DETAILS'
console.log(storeDetails({ name: 'John', surname: 'Doe' }));
// { type: 'INCREMENT', payload: {name: 'John', surname: 'Doe'} };
```

### createReducer

This is the helper function that `robodux` uses to create a reducer. This
function maps action types to reducer functions. It will return a reducer.

```
{
  initialState: any, // the initial state for the reducer
  reducers: object, // the action to reducer map
  name: string, // optional, sends value to `toString`
  useImmer: boolean, // default, true, determines whether or not to use immer
}
```

```js
import { createReducer } from 'robodux';

const counter = createReducer({
  initialState: 0,
  reducers: {
    INCREMENT: (state) => state + 1,
    DECREMENT: (state) => state - 1,
    MULTIPLY: (state, payload) => state * payload,
  }
});

console.log(counter(2, { type: 'MULTIPLY': payload: 5 }));
// -> 10
```

### createActionMap (v5.0.0)

This is a helper function to combine actions from multiple slices. This is
create when composing multiple slices into a module that will then be exported.

```js
import { createSlice, createActionMap } from 'robodux';

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducts: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

const loading = createSlice({
  name: 'loading',
  initialState: false,
  reducts: {
    loading: (state, payload) => payload,
  },
});

/*
This is the same as doing this:
const actions = {
  ...counter.actions.
  ...loading.actions,
};
*/
const actions = createActionMap(counter, loading);
/*
{
  inc: (payload?: any) => Action<any>;
  dec: (payload?: any) => Action<any>;
  loading: (payload: boolean) => Action<boolean>;
}
*/

export { actions };
```

### createReducerMap (v5.0.0)

This is a helper function to combine reducers from multiple slices. This is
useful when composing multiple slices into a module that will then be exported.
This does _not_ use `combineReducers` under the hood, it simply creates an
object where the key is the slice name and the value is the reducer function.

```js
import { createSlice, createReducerMap } from 'robodux';

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducts: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

const loading = createSlice({
  name: 'loading',
  initialState: false,
  reducts: {
    loading: (state, payload) => payload,
  },
});

/*
This is the same thing as doing this:
const reducers = {
  [counter.name]: counter.reducer,
  [loading.name]: loading.reducer,
};
*/
const reducers = createReducerMap(counter, loading);
/*
{
  counter: Reducer<number, Action<any>>;
  loading: Reducer<boolean, Action<any>>;
}
*/

export { reducers };
```

### mapSlice

See slice helpers for more info

### assignSlice

See slice helpers for more info

### loadingSlice

See slice helper for more info
