# How to use a slice helper

If we think of the redux store as a database then a reducer can be thought of as
a table. The most similar data structure to a table is a json object where the
keys are ids and the values are json objects. We have created a slice helper
that creates some very common actions that manage that table.

## mapSlice

```js
import { mapSlice } from 'robodux';

interface SliceState {
  [key: string]: { name: string, email: string };
}

const name = 'test';
const { reducer, actions } = mapSlice<SliceState>({ name });
const state = {
  3: { name: 'three', email: 'three@three.com' }
};

store.dispatch(
  actions.add({
    1: { name: 'one', email: 'one@one.com' },
    2: { name: 'two', email: 'two@two.com' },
  })
);
/* {
  1: { name: 'one', email: 'one@one.com' },
  2: { name: 'two', email: 'two@two.com' },
  3: { name: 'three', email: 'three@three.com' },
} */

store.dispatch(
  actions.set({
    4: { name: 'four', email: 'four@four.com' },
    5: { name: 'five', email: 'five@five.com' },
    6: { name: 'six': email: 'six@six.com' },
  })
)
/* {
  4: { name: 'four', email: 'four@four.com' },
  5: { name: 'five', email: 'five@five.com' },
  6: { name: 'six': email: 'six@six.com' },
} */

store.dispatch(
  actions.remove(['5', '6'])
)
/* {
  4: { name: 'four', email: 'four@four.com' },
} */

// only update a part of the entity
store.dispatch(
  actions.patch({
    4: { name: 'five' }
  })
)
/* {
  4: { name: 'five', email: 'four@four.com' },
} */

store.dispatch(
  actions.reset()
)
// {}
```

## assignSlice (v2.1.0)

These are common operations when dealing with a slice that simply needs to be
set or reset. You can think of this slice helper as a basic setter. I regularly
use this for things like setting a token in my app or if I'm prototyping and I
just need something quick.

```js
import { assignSlice } from 'robodux';

type SliceState = string;

const name = 'token';
const { reducer, actions } =
  assignSlice < SliceState > { name, initialState: '' };

store.dispatch(actions.set('some-token'));
/* redux state: { token: 'some-token' } */

store.dispatch(actions.set('another-token'));
/* redux state: { token: 'another-token' } */

store.dispatch(actions.reset());
// redux state: { token: '' }
```

## loadingSlice (v3.0)

Helper slice that will handle loading data

```js
import { loadingSlice, LoadingItemState } from 'robodux';

const { actions, reducer } = loadingSlice({ name: 'loading' });
store.dispatch(actions.loading('something loading'));
// redux state: { loading: { error: '', message: 'something loading', loading: true, success: false } }

store.dispatch(actions.success('great success'));
// redux state: { loading: { error: '', message: 'great success', loading: false, success: true } }

store.dispatch(actions.error('something happened'));
// redux state: { loading: { error: 'something happened', loading: false, success: false } }
```

*NOTE*: We do **not** use `immer` for any slice helpers.  Since they are highly reusable pieces of code, we are comfortable properly handling reducer logic without the performance overhead of `immer`.