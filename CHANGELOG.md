# CHANGES

## 11.0.0 (06-06-2021)

- :wrench: Remove `immer` as a peer dependency and made it a normal dependency
- :boom: `createLoader` and `createLoaderTable` now hold different state,
  please see documentation for details

## 10.1.3 (05-31-2021)

- :sparkles: `createLoaderTable` now returns `getSelectors` function that makes
  it easier to get loaders out of the slice

## 10.1.1 (2-22-2020)

- :wrench: improved typings for `mustSelectEntity`

## 10.1.0 (12-20-2020)

- :sparkles: `createListTable` which makes it easier to have a table of lists
- :wrench: added `meta` object to `createLoader` state so we can pass arbitrary data through our loaders

## 10.0.0 (10-08-2020)

- :heavy_plus_sign: added `reselect` as a peer dependency
- :boom: renamed `createTable` -> `createMap`
- :sparkles: new `createTable` API with extended functionality to `createMap`
  - new function `getSelectors` which will build a bunch of useful selectors
    automatically: selectTable, selectTableAsList, selectById, selectByIds which
    are properly memoized
- :sparkles: new function `mustSelectEntity` which will enforce that the return
  type of `*ById` (find, select) _must_ return the table entity instead of
  possibly returning undefined
- :sparkles: `createMap` and `createTable` have a new action called `merge`
  which will merge objects and arrays one layer deep

## 9.1.0 (07-10-2020)

- :sparkles: `createList` slice helper to manage lists in redux state

## 9.0.0 (05-09-2020)

- :wrench: Changed the name of slice helpers to better illustrate intent
  - mapSlice -> createTable
  - assignSlice -> createSlice
  - loadingSlice -> createLoader
  - loadingMapSlice -> createLoaderTable

## 8.2.0 (03-06-2020)

- :wrench: improved timestamps for loading slice

## 8.1.0 (02-15-2020)

- :sparkles: New loading slice `loadingMapSlice` which is the same as
  `loadingSlice` only it can spawn unique loaders

## 8.0.0 (02-15-2020)

- :wrench: Breaking changes to `loadingSlice`
  - `error` from string -> boolean
  - `timestamp` property which is a unix timestamp updated on every loader
    update

## 7.0.1 (01-05-2020)

- :sparkles: Created new API for reusing our slice helper reducers:
  `mapReducers`, `assignReducers`, and `loadingReducers`

## 7.0.0 (12-02-2019)

- :wrench: Improved typings for `createAction`
- :wrench: Allow custom data for `error` and `message` inside `loadingSlice`

## 6.0.0 (11-04-2019)

- :wrench: Improved typings for a better developer experience

## 5.1.4 (10-29-2019)

- :bug: `mapSlice` was mutating state object incorrectly

## 5.1.3 (10-22-2019)

- :wrench: attempting to improve typing for `createApp`

## 5.1.2 (10-18-2019

- :bug: createApp would fail if object passed did not contain a `reducers` key

## v5.1.1 (10-18-2019)

- :bug: Make `immer` and `redux` peer dependencies

## v5.1.0 (10-06-2019)

- :sparkles: initial `createApp` which will accept an array of modules and
  return a reducer

## v5.0.0 (09-12-2019)

- :boom: removed optional slice for `createSlice`, it is now required and cannot
  be empty
- :boom: `useImmer` option, enabled by default, disabled specifically for slice
  helpers
- :boom: renamed `slice` to `name` for `createSlice`, `createReducers` and all
  slice helpers
- :boom: renamed `actions` to `reducers` for `createSlice` to signal that it is
  a mapping between action names and reducers: `reducer` + `action` = `reduct`
- :sparkles: `createActionMap` helper function to combine actions from multiple
  slices
- :sparkles: `createReducerMap` helper function to combine reducers from
  multiple slices

## v4.2.0 (04-24-2019)

- :sparkles: loading slice has a reset action
- :sparkles: loading slice now accepts a message when loading or success

## v4.1.0 (04-11-2019)

- :sparkles: add new action `patchX` to `mapSlice` which allows partial updates
  to an entity

## v4.0.0 (03-13-2019)

- :hammer: removed `selectors` from robodux

`selectors` in robodux was struggling to be useful and ultimately we decided to
remove it entirely from the library.

## v3.0.0 (02-21-2019)

- :sparkles: `extraActions` parameter to `robodux` allows reducers to listen to
  external action types
- :sparkles: `loadingSlice` is a new slice helper that handles loading states
- :boom: `mapSlice` now accepts an object instead of a `slice` string, e.g.
  mapSlice('aSlice') -> mapSlice({ slice: 'aSlice' })

## v2.1.0 (01-16-2019)

- :sparkles: Added assign slice helper

## v2.0.0 (01-06-2019)

- :sparkles: Better typescript support

## v1.2.0 (12-29-2018)

- :sparkles: map slice helper
