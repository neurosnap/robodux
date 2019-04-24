# CHANGES

## v4.2.0 (04-24-2019)

* :sparkles: loading slice has a reset action
* :sparkles: loading slice now accepts a message when loading or success

## v4.1.0 (04-11-2019)

* :sparkles: add new action `patchX` to `mapSlice` which allows partial updates to an entity

## v4.0.0 (03-13-2019)

* :hammer: removed `selectors` from robodux

`selectors` in robodux was struggling to be useful and ultimately we decided
to remove it entirely from the library.

## v3.0.0 (02-21-2019)

* :sparkles: `extraActions` parameter to `robodux` allows reducers to listen to external action types
* :sparkles: `loadingSlice` is a new slice helper that handles loading states
* :boom: `mapSlice` now accepts an object instead of a `slice` string, e.g. mapSlice('aSlice') -> mapSlice({ slice: 'aSlice' })

## v2.1.0 (01-16-2019)

* :sparkles: Added assign slice helper

## v2.0.0 (01-06-2019)

* :sparkles: Better typescript support

## v1.2.0 (12-29-2018)

* :sparkles: map slice helper
