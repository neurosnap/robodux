# FAQ

## Why not `redux-toolkit`?

This library was heavily inspired by
[autodux](https://github.com/ericelliott/autodux) and
[redux-toolkit](https://github.com/reduxjs/redux-toolkit). The reason why I
decided to create a separate library was primarily for:

- no external dependencies besides `immer`
- slice helpers
- philosophical differences

[I wrote the original implementation for `createSlice` in redux-toolkit](https://github.com/reduxjs/redux-toolkit/issues/17#issuecomment-414543588)
and have used it in production since I wrote that comment. After building many
apps using `createSlice` I've realized that for the most part, `createSlice` is
actually a low-level function I rarely need to use. Using higher-level slice
helpers like `createTable`, most of the need to use `createSlice` goes away.

At this point in time, the primary benefit to use `robodux` over `redux-toolkit`
is to leverage slice helpers.

The only parallel to the slice helpers we have created would be the new
`createEntityAdapter` which more directly resembles our `createTable` or
`tableReducers`. We have built more helpers to accommodate different use-cases
such as simple data structures `createAssign` and something more functional like
our loaders `createLoader` or `createLoaderTable`.

`redux-toolkit` is also trying to be opinionated about how people should use it.
The driving motivation for `redux-toolkit` is to be able to install it and
nothing else to get redux setup with minimal boilerplate. It accomplishes this
goal by installing `redux` and other dependencies and re-exports them. This is
certainly welcome for many developers, however, `robodux` isn't trying to
supersede `redux`. Instead, the goal of `robodux` is to be an addition to
`redux` in a non-intrusive manner and to build scalable applications by using a
set of repeatable functions that store commonly used data structures in `redux`.
`redux-toolkit` still recommends `redux-thunk` for most applications which is a
poor choice for managing side-effects in a `redux` application and should only
be used for very simple applications.

Redux wants reducers to be the star of the application. This library
de-emphasizes `redux` and heavily emphasizes side-effect libraries like
`redux-saga`.
