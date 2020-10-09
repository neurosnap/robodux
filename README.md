# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

- [Documentation](https://robodux.erock.io)
- [Style guide](https://erock.io/redux-saga-style-guide)

One of the biggest complaints developers have with redux is the amount of
boilerplate and new concepts they have to learn to use it. By using the
`robodux` pattern the amount of redux boilerplate is dramatically reduced. In
most cases, wiring up action types, action creators, and reducers can be done in
one line of code.

## Features

- A reusable pattern to build actions and reducers
- Slice helpers that create action types, action creators, and a reducer for
  common data structures (e.g. createTable, createMap, createAssign, and createLoader)
- Reducers leverage [immer](https://github.com/mweststrate/immer) which makes
  updating state easy
- When stringifying action creators they return the action type
- Reducers do not receive entire action object, only payload
- Low level functions to build your own slices, actions, and reducers

## What's included

- `createTable`: Thinking of reducers as database tables, this function builds
  actions and a reducer pair that builds simple and repeatable operations for
  that table.
- `createMap`: A normal object datastructure, less strict than `createTable` but most of the same functionality
- `createAssign`: A catch-all data structure that makes it easy to set or reset
  the reducer.
- `createList`: Store an array of items in a slice
- `createLoader`: A flexible data structure that makes it easy to apply loading
  states to certain operations.
- `createLoaderTable`: Store as many independent loaders in this reducer which are
  all accessible by an `id`.
- `createSlice`: Core function that the above slice helpers leverage.  Build action types, action creators, and reducer pairs with one
  simple function.
- `createAction`: A very simple way to build type-safe actions.
- `createReducer`: Build reducers using an object instead of a switch-case.
- `createActionMap`: given multiple slices created via `createSlice`, combine them
  to get a flat object of actions.
- `createReducerMap`: given multiple slices created via `createSlice`, combine
  them to get a flat object of reducers (to pass to `combineReducers`).
- `createApp`: given multiple packages that contain multiple slices, combine them
  to get a flat object of reducers (to pass to `combineReducers`).

## Core principles

The overriding principle is that effects (like sagas) should be the central
processing unit for all business logic in a react/redux application. We should
remove as much business logic as possible from reducers and instead centralize
them inside of our side-effect handlers.

The other primary principle is to think of redux as a database and reducers as
tables. This simplifies the action/reducer logic and makes it possible to build
reuseable components which dramatically reducers boilerplate.

Please see [style-guide](https://erock.io/redux-saga-style-guide) for more
details.
