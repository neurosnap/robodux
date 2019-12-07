# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it. By using the
`robodux` pattern the amount of redux boilerplate is dramatically reduced. In
most cases, wiring up action types, action creators, and reducers can be done in
one line of code.

## Features

- A reusable pattern to build actions and reducers
- Slice helpers that create action types, action creators, and a reducer for
  common data structures (map, list, assign, and loading)
- Reducers leverage [immer](https://github.com/mweststrate/immer) which makes
  updating state easy
- When stringifying action creators they return the action type
- Reducers do no receive entire action object, only payload
- Helper functions `createAction`, `createReducer`, and `createSlice`

## Core principles

While many of the utilities built in this library mimic that of
[redux-toolkit](https://github.com/redux/redux-toolkit) the philosophy behind
how someone should use them are different.

The overriding principle is that effects (like sagas) should be the central
processing unit for all business logic in a react/redux application. We should
remove as much business logic as possible from reducers and instead centralize
them inside of our side-effect handlers.

Please see [style-guide](https://github.com/neurosnap/robodux) for more details.

## Why not `redux-toolkit`?

This library was heavily inspired by
[autodux](https://github.com/ericelliott/autodux) and
[redux-toolkit](https://github.com/redux/redux-toolkit). The reason why I
decided to create a separate library was primarily for:

- no external dependencies besides `immer`
- slice helpers
- philosophical differences

At this point in time, the primary benefit to use `robodux` over
`redux-starter-kit` is to leverage slice helpers. RSK is also trying to be
opinionated about how people should use it. The driving motivation for RSK is to
be able to install it and nothing else to get redux setup with minimal
boilerplate. It accomplishes this goal by installing `redux` and other
dependencies and re-exports them. This is certainly welcome for many developers,
however, `robodux` isn't trying to supersede `redux`. Instead, the goal of
`robodux` is to be an addition to `redux` in a non-intrusive manner and to build
scalable applications using a wealth of knowledge and experience.
`redux-toolkit` still recommends `redux-thunk` for most applications, which
based on our experience, is a poor choice for managing side-effects in a `redux`
application.

Redux wants reducers to be the star of the application. This library
de-emphasizes `redux` and heavily emphasizes `redux-saga`.

## Usage

## mapSlice

```js
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

### assignSlice (v2.1.0)

These are common operations when dealing with a slice that simply needs to be
set or reset

params: { name, initialState, extraReducers }

```js
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

### loadingSlice (v3.0)

Helper slice that will handle loading data

params: { name, extraReducers }

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