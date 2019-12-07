# createSlice

```js
import { createSlice } from 'robodux';
import { createStore, combineReducers, Action } from 'redux';

interface CounterActions {
  increment: never;  // <- indicates no payload expected
  decrement: never;
  multiply: number;  // <- indicates a payload of type number is required
}

const counter = createSlice<number, CounterActions>({
  name: 'counter', // action types created by robodux will be prefixed with slice, e.g. { type: 'countr/increment' }
  initialState: 0,
  reducts: {
    increment: (state) => state + 1,  // state is type cast as a number from the supplied slicestate type
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

## Types

`robodux` accepts two generics: `Actions` and `SliceState`.

`Actions` helps improve auto-complete and typing for the `actions` object
returned from `robodux`. Supply an interface where they keys are the action
names and the values are the payload types, which should be `never` if the
action takes no payload.

`SliceState` is the state shape of the particular slice created with `robodux`.
If there is no slice passed to the state, then this will assume that this is the
entire state shape.

```js
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

actions.setTest('ok'); // autocomplete and type checking for payload(string), typeerror if called without payload
actions.setTest(0); // autocomplete and type checking for payload(number), typeerror if called without payload
actions.reset(); // typechecks to ensure action is called without params
```

### extraReducers (v5.0)

By default `createSlice` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.

```js
const user = createSlice<User, UserActions>({
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