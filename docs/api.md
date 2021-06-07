# API

- [createTable](#createtable)
- [createAssign](#createassign)
- [createList](#createlist)
- [createListTable](#createlisttable)
- [createLoader](#createloader)
- [createLoaderTable](#createloadertable)
- [createMap](#createmap)
- [createReducerMap](#createreducermap)
- [createApp](#createapp)
- [createSlice](#createslice)

## Interface for all slice helpers

```ts
interface ActionsAny<P = any> {
  [Action: string]: P;
}

interface SliceHelper<State> {
  name: string;
  initialState?: State;
  extraReducers?: ActionsAny;
}
```

## createTable

```ts
interface TableActions<S> {
  add: MapEntity<S>;
  set: MapEntity<S>;
  remove: string[];
  patch: PatchEntity<MapEntity<S>>;
  merge: PatchEntity<MapEntity<S>>;
  reset: never;
}

interface TableSelectors<Entity extends AnyState = AnyState, S = any> {
  findById: (d: MapEntity<Entity>, { id }: PropId) => Entity | undefined;
  findByIds: (d: MapEntity<Entity>, { ids }: PropIds) => Entity[];
  tableAsList: (d: MapEntity<Entity>) => Entity[];
  selectTable: (s: S) => MapEntity<Entity>;
  selectTableAsList: (state: S) => Entity[];
  selectById: (s: S, p: PropId) => Entity | undefined;
  selectByIds: (s: S, p: { ids: string[] }) => Entity[];
}

interface CreateTableReturn<Entity> {
  name: string;
  actions: TableActions<MapEntity<Entity>>;
  reducer: Reducer;
  getSelectors: <S>(state: S) => TableSelectors<Entity, S>
}
```

## createAssign

```ts
interface AssignActions<S> {
  set: S;
  reset: never;
}

interface CreateAssignReturn<S> {
  name: string;
  actions: AssignActions<S>;
  reducer: Reducer;
}
```

## createList

```ts
interface ListActions<S> {
  add: S;
  remove: number[];
  reset: never;
}

interface CreateListReturn<S> {
  name: string;
  actions: ListActions<S>;
  reducer: Reducer;
}
```

## createListTable

```ts
interface ListTableActions<M extends any[]> {
  add: MapEntity<M>;
  set: MapEntity<M>;
  remove: string[];
  reset: never;
  addItems: MapEntity<M>;
}

interface CreateListTableReturn<M extends any[]> {
  name: string;
  actions: ListTableActions<M>;
  reducer: Reducer;
}
```

## createLoader

```ts
interface LoadingItemState {
  status: 'idle' | 'loading' | 'error' | 'success'
  message: string;
  lastRun: number;
  lastSuccess: number;
  meta: { [key: string]: any };
}

interface LoadingActions {
  loading: LoadingPayload;
  success: LoadingPayload;
  error: LoadingPayload;
  reset: never;
}

interface CreateLoaderReturn {
  name: string;
  actions: LoadingActions;
  reducer: Reducer;
}
```

Helper slice that will handle loading data.  The main idea here is that we want 
to decouple data from UI and since loaders are primarily used to display loaders 
in the UI, they should be separated.

This has a unique benefit to where we can create loaders for any data as well 
as any combination of fetches.

`createLoader` creates a global loader that can be used as a single loader.

## createLoaderTable

```ts
interface LoadingItemState {
  status: 'idle' | 'loading' | 'error' | 'success';
  message: string;
  lastRun: number;
  lastSuccess: number;
  meta: { [key: string]: any };
}

interface LoadingState extends LoadingItemState {
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
}

type LoaderTableState = MapEntity<LoadingItemState>;

type LoadingMapPayload = LoadingPayload & { id: string };

interface LoadingMapActions {
  loading: LoadingMapPayload;
  success: LoadingMapPayload;
  error: LoadingMapPayload;
  remove: string[];
  resetById: string;
  resetAll: never;
}

interface LoaderTableSelectors<S = any> {
  findById: (d: LoaderTableState, { id }: PropId) => LoadingState;
  findByIds: (d: LoaderTableState, { ids }: PropIds) => LoadingState[];
  selectTable: (s: S) => LoaderTableState;
  selectById: (s: S, p: PropId) => LoadingState;
  selectByIds: (s: S, p: { ids: string[] }) => LoadingState[];
}

interface CreateLoaderTableReturn {
  name: string;
  actions: LoadingMapActions;
  reducer: Reducer;
  getSelectors: <S>(state: S) => LoaderTableSelectors<S>;
}
```

## createMap

```ts
interface MapActions<S> {
  add: S;
  set: S;
  remove: string[];
  patch: PatchEntity<S>;
  reset: never;
}

interface CreateMapReturn<S> {
  name: string;
  actions: MapActions<S>;
  reducer: Reducer;
}
```

This has the same actions as `createTable` but doesn't have to adhere to the 
value being a json object.

```ts
import { createMap } from 'robodux';

const { reducer, actions } = createMap<{ [key: string]: string }>({ name: 'text' });
store.dispatch(actions.add({ 1: 'some text' }));
/*
{
  text: {
    1: 'some text'
  }
}
*/
```

## createReducerMap

```ts
createReducerMap(
  ...args: { name: string; reducer: Reducer }[]
) => { [key: string]: Reducer };
```

## createApp

```ts
createApp<S = any>({ 
  reducers: { [key: string]: Reducer } 
}[]) => { reducer: Reducer }
```

## createSlice

Think of a slice as a single reducer.

_NOTE_: By default, this library uses [immer](https://github.com/immerjs/immer)
for its reducers. I highly recommend anyone using this library to understand how
it works and its performance ramifications.

```ts
interface SliceOptions<SliceState = any, Ax = ActionsAny> {
  initialState: SliceState;
  reducers: ActionsObjWithSlice<SliceState, Ax>;
  name: string;
  extraReducers?: ActionsAny;
  useImmer?: boolean;
}
```

```ts
const rootReducer = combineReducers({
  token: (state, payload) => payload, // this is a slice
  users: (state, payload) => payload, // this is a slice
  userSelected: (state, payload) => payload, // this is a slice
  comments: (state, payload) => payload, // this is a slice
});
// aside: you should always configure your store as flat as possible
// think of the store as a database where the slice is a table
```

This function helps build a slice for your application. It will create action
types, action creators, and reducers.

```ts
import { createSlice, createReducerMap } from 'robodux';
import { createStore, combineReducers, Action } from 'redux';

interface CounterActions {
  increment: never; // <- indicates no payload expected
  decrement: never;
  multiply: number; // <- indicates a payload of type number is required
}

const counter = createSlice<number, CounterActions>({
  name: 'counter', // action types created by robodux will be prefixed with slice, e.g. { type: 'counter/increment' }
  initialState: 0,
  reducers: {
    // reducers = reducer + actions (stupid, I know)
    increment: (state) => state + 1, // state is type cast as a number from the supplied slice state type
    decrement: (state) => state - 1,
    multiply: (state, payload) => state * payload, // payload here is type cast as number as from CounterActions
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
  reducers: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  },
});

const reducers = createReducerMap(user, counter);
const reducer = combineReducers(reducers);
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
