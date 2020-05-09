# API

## createTable (alias: mapSlice)

params: { name, initialState, extraReducers }

```ts
interface SliceHelper<State> {
  name: string;
  initialState?: State;
  extraReducers?: ActionsAny;
}
```

## createAssign (alias: assignSlice)

params: { name, initialState, extraReducers }

```ts
interface SliceHelper<State> {
  name: string;
  initialState?: State;
  extraReducers?: ActionsAny;
}
```

## createLoader (alias: loadingSlice)

params: { name, extraReducers }

```ts
interface Props {
  name: string;
  extraReducers?: ActionsAny;
}
```

The data structure for a loader looks like this:

```ts
interface LoadingItemState<M = string> {
  message: M;
  error: boolean;
  loading: boolean;
  success: boolean;
  lastRun: number;
  lastSuccess: number;
}
```

## createLoaderTable (alias: loadingMapSlice)

This creates a map or loading slices. This is great if you want many loaders.

params: { name, extraReducers }

```ts
interface Props {
  name: string;
  extraReducers?: ActionsAny;
}
```

```ts
import { createLoaderTable } from 'robodux';

const name = 'loader';
const loader = createLoaderTable({ name });

export const {
  loading: setLoaderStart,
  error: setLoaderError,
  success: setLoaderSuccess,
  resetById: resetLoaderById,
  resetAll: resetAllLoaders,
} = loader.actions;

store.disptch(setLoaderStart({ id: 'users' }));
/*
{
  loader: {
    users: {
      loading: true,
      success: false,
      error: false,
      message: '',
      timestamp: {unix}
    }
  }
}
*/

store.dispatch(setLoaderSuccess({ id: 'users', message: 'you did it!' }));
/*
{
  loader: {
    users: {
      loading: false,
      success: true,
      error: false,
      message: 'you did it!',
      timestamp: {unix}
    }
  }
}
*/
```

## createSlice

This is the default export for robodux and will automatically create actions,
reducer, and selectors for you.

```ts
interface SliceOptions<SliceState = any, Ax = ActionsAny> {
  initialState: SliceState;
  reducts: ActionsObjWithSlice<SliceState, Ax>;
  name: string;
  extraReducers?: ActionsAny;
  useImmer?: boolean;
}
```

## createAction

This is the helper function that `robodux` uses to create an action. It is also
useful to use when not using robodux because when stringifying the function it
will return the action type. This allows developers to not have to worry about
passing around action types, instead they simply pass around action creators for
reducers, sagas, etc.

```ts
import { createAction } from 'robodux';

// by adding a type to `createAction` we force the action to have a payload when dispatching
const increment = createAction<number>('INCREMENT');
console.log(increment);
// -> 'INCREMENT'
console.log(increment(2));
// { type: 'INCREMENT', payload: 2 };
const storeDetails = createAction<{ name: string; surname: string }>(
  'STORE_DETAILS',
);
console.log(storeDetails);
// -> 'STORE_DETAILS'
console.log(storeDetails({ name: 'John', surname: 'Doe' }));
// { type: 'INCREMENT', payload: {name: 'John', surname: 'Doe'} };

// when no type is passed to `createAction` then a payload is not required
const fetchData = createAction('FETCH_DATA');
fetchData();
```

## createReducer

This is the helper function that `robodux` uses to create a reducer. This
function maps action types to reducer functions. It will return a reducer.

```ts
type CreateReducer<State = any> = {
  initialState: State;
  reducers: ReducerMap<State, any>;
  name?: string;
  useImmer?: boolean;
};
```

```ts
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

## createActionMap (v5.0.0)

This is a helper function to combine actions from multiple slices. This is
create when composing multiple slices into a module that will then be exported.

```ts
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

## createReducerMap (v5.0.0)

This is a helper function to combine reducers from multiple slices. This is
useful when composing multiple slices into a module that will then be exported.
This does _not_ use `combineReducers` under the hood, it simply creates an
object where the key is the slice name and the value is the reducer function.

```ts
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

## createApp

Given an array of modules with type `{ reducer: { [key: string]: Reducer } }` we
will combine the reducers using `combineReducers` from redux.

When registering all the packages you've created, it's important to combine all
the reducers to build a root reducer. `createApp` is a little helper that knows
the structure of a package and understands how to combine all reducers.

```ts
import sagaCreator from 'redux-saga-creator';

import * as users from './users';
import * as comments from './comments';

const corePackages = [users, comments];
const packages = createApp<State>(corePackages);
const rootReducer = packages.reducer;

const sagas = corePackages.reduce((acc, pkg) => {
  if (!pkg.sagas) return acc;
  return { ...acc, ...pkg.sagas };
}, {});
const rootSaga = sagaCreator(sagas, (err: Error) => {
  console.error(err);
});
```

## Common reducers

All the following functions are primarily for creating new slice helpers by
reusing the reducers we have built.

### tableReducers

These are the reducers used for `createTable`.

```ts
function tableReducers<State extends AnyState>(
  initialState?: State,
): {
  add: (state: State, payload: State) => State;
  set: (state: State, payload: State) => State;
  remove: (state: State, payload: string[]) => State;
  reset: (state: State) => State;
  patch: (
    state: State,
    payload: { [key: string]: Partial<State[keyof State]> },
  ) => State;
};
```

### assignReducers

These are the reducers used for `createAssign`.

```ts
function assignReducers<State>(
  initialState: State,
): {
  set: (s: State, p: State) => State;
  reset: () => State;
};
```

### loadingReducers

These are the reducers used for `createLoader`.
