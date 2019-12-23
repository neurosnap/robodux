# Extra reducers

By default `createSlice` will prefix any action type with the name of the slice.
However, sometimes it is necessary to allow external action types to effect the
reducer.

```js
const user = createSlice<User, UserActions>({
  name: 'user',
  initialState: { name: '', address: '' },
  reducts: {
    setUserName: (state, payload) => {
      state.name = payload; // mutate the state all you want with immer
    },
  },
  extraReducers: {
    setAddress: (state, payload) => {
      state.address = payload;
    }
  }
})

store.dispatch({ type: 'setAddress', payload: '1337 tsukemen rd' });
store.getState();
// { name: '', address: '1337 tsukemen rd' }
```