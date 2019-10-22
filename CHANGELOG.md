# CHANGES

## 5.1.3 (10-22-2019)

- :wrench: attempting to improve typing for `createApp`

## 5.1.2 (10-18-2019

- :bug: createApp would fail if object passed did not contain a `reducers` key

## v5.1.1 (10-18-2019)

- :bug: Make `immer` and `redux` peer dependencies

## v5.1.0 (10-06-2019)

- :sparkles: initial `createApp` which will accept an array of modules and return a reducer

## v5.0.0 (09-12-2019)

- :boom: removed optional slice for `createSlice`, it is now required and cannot
  be empty
- :boom: `useImmer` option, enabled by default, disabled specifically for slice
  helpers
- :boom: renamed `slice` to `name` for `createSlice`, `createReducers` and all
  slice helpers
- :boom: renamed `actions` to `reducts` for `createSlice` to signal that it is a
  mapping between action names and reducers: `reducer` + `action` = `reduct`
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
