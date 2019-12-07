## API

### createSlice

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

### createApp

Given an array of modules with type `{ reducer: { [key: string]: Reducer } }` we
will combine the reducers using `combineReducers` from redux.
