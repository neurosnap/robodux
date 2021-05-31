# Advanced Concepts

## Building a slice helper

Let's say we want to store a data structure that is a hash map where the key is
the `id` and the value is a list of ids. We want to add some extra operations to
this functionality to be able to remove ids from a single list and merge two
lists together.

```ts
import { mapReducers, SliceHelper, createSlice } from 'robodux';

// specify actions like any other usage of `createSlice`
interface ListCreateTable<S> {
  add: S;
  set: S;
  remove: string[];
  removeItems: string[];
  reset: never;
  merge: S;
}

export default function createListTable<
  State extends { [name: string]: string[] }
>({ name, initialState = {} as State, extraReducers }: SliceHelper<State>) {
  // here we are reusing reducers created for createTable
  const { add, set, remove, reset } = mapReducers(initialState);

  return createSlice<State, createListTable<State>>({
    name,
    initialState,
    extraReducers,
    // we don't need immer for these reducers
    useImmer: false,
    reducers: {
      add,
      set,
      remove,
      reset,
      // we would like to be able to remove elements from a list inside a map
      removeItems: (state: State, payload: string[]) => {
        const newState = { ...state };
        Object.keys(newState).forEach((key: keyof State) => {
          const list = [...newState[key]];
          (newState as any)[key] = list.filter(
            (item) => !payload.includes(item),
          );
        });
        return newState;
      },
      // we would like to merge two lists together inside a map
      merge: (state: State, payload: State) => {
        const newState = { ...state };
        Object.keys(payload).forEach((key) => {
          const k: keyof State = key;
          const curState = newState[k] || [];
          const rmDupes = new Set([...curState, ...payload[key]]);
          (newState as any)[k] = [...rmDupes];
        });
        return newState;
      },
    },
  });
}
```
