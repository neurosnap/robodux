# robodux [![Build Status](https://travis-ci.org/neurosnap/robodux.svg?branch=master)](https://travis-ci.org/neurosnap/robodux)

- [Documentation](https://neurosnap.github.io/robodux)
- [API reference](https://neurosnap.github.io/robodux/api.html)
- [Style guide](https://erock.io/redux-saga-style-guide)

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
- Reducers do not receive entire action object, only payload
- Low level functions to build your own slices, actions, and reducers

## Core principles

The overriding principle is that effects (like sagas) should be the central
processing unit for all business logic in a react/redux application. We should
remove as much business logic as possible from reducers and instead centralize
them inside of our side-effect handlers.

Please see [style-guide](https://erock.io/redux-saga-style-guide) for more details.
