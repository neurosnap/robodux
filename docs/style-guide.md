# Style guide

- [style-guide](https://erock.io/redux-saga-style-guide)

## The robodux pattern

This is [ducks](https://github.com/erikras/ducks-modular-redux) on steroids.
[robodux](https://github.com/neurosnap/robodux) is a library I wrote that works
extremely well with `redux-saga` and this style-guide.

The anatomy of a package:

```ts
// this package is called `people`.  It manages all the people being added to our
// system.
import { call, put, takeEvery } from 'redux-saga/effects';
import { mapSlice, createReducerMap, createAction } from 'robodux';
import { createSelector } from 'reselect';

// These are global types.  Packages should not export the reducer state types
// to avoid circular dependencies
import { Person, PeopleMap, State, Action } from '@app/types';
// generic effect for fetching from API, wraps window.fetch in this example
import {
  ApiFetchResponse,
  apiFetch,
  apiSuccess,
  ErrorResponse,
} from '@app/fetch';
// generic loader reducer slice `loadingSlice`
import { setLoaderStart, setLoaderError, setLoaderSuccess } from '@app/loader';

// creating an entity with sane defaults is very useful when you want your app
// to always expect some structure.  This helps reduce the need for existential
// checks.  I use them everywhere.  These are also very useful for writing
// tests that care about type safety.
export const defaultPerson = (p: Partial<Person> = {}): Person => {
  const now = new Date().toISOString();
  return {
    id: '',
    name: '',
    email: '',
    createdAt: now,
    updatedAt: now,
    ...p,
  };
};

// Here we are creating a reducer and its corresponding actions
// a mapSlice is a slice helper for create a db table like structure:
// the key is the entity id and the value is the object
const name = 'people';
const people = mapSlice<PeopleMap>({ name });

// These are the actions for manage the data inside the people reducer.
// add -> add entities to db table
// set -> remove previous entities and add new ones
// remove -> ids to remove from db table
// reset -> reset to `initialState`, usually {}
// patch -> update a property on an entity
export const {
  add: addPeople,
  set: setPeople,
  remove: removePeople,
  reset: resetPeople,
  patch: patchPeople,
} = people.actions;

// helper when there are multiple slices inside a single package -- which is
// allowed and suggested.
export const reducers = createReducerMap(people);

// selectors are always prefixed with `select`.  These should be exported so
// other packages and the UI layer can use them
export const selectPeople = (state: State) => state[name] || {};
export const selectPeopleAsList = createSelector(
  selectPeople,
  (peeps) => Object.values(peeps),
);
export const selectPerson = (state: State, { id }: { id: string }) =>
  selectPeople(state)[id];

interface PersonResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
}

interface PeopleResponse {
  people: PersonResponse[];
}

// another function that extremely helpful.  Transform functions take the API
// response and transforms them into the entities all our code uses.
function transformPerson(p: PersonResponse): Person {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// action to fetch people
export const fetchPeople = createAction<string>('FETCH_PEOPLE');

// where all of our business logic goes for fetching/storing people
function* onFetchPeople(action: Action<string>) {
  const orgId = action.payload;
  if (!orgId) {
    return;
  }

  yield put(setLoaderStart());
  const resp: ApiFetchResponse<PeopleResponse> = yield call(
    apiFetch,
    `/orgs/${orgId}/people`,
  );

  if (!apiSuccess(resp)) {
    yield put(setLoaderError(resp));
    return;
  }

  const curPeople = resp.data.people
    .map(transformPerson)
    .reduce<PeopleMap>((acc, person) => {
      acc[person.id] = person;
      return acc;
    }, {});

  // use `batchActions` to silence any arguments against sequential dispatches
  yield put(batchActions([addPeople(curPeople), setLoaderSuccess()]));
}

function* watchFetchPeople() {
  yield takeEvery(`${fetchPeople}`, onFetchPeople);
}

// export all sagas so they can be mounted when creating redux store
export const sagas = {
  watchFetchPeople,
};
```

#### Rules

1. _May_ contain multiple slices
2. _May_ export named `reducers` which is an object where keys are the reducer
   name and the value is the reducer.
3. _May_ export named `sagas` which is an object containing sagas that should be
   mounted when creating store.
4. _May_ export actions to hit reducers or sagas
5. _May_ export selectors for data from reducer or parent data
6. _Must_ prefix selectors with `select`
7. _Must_ prefix getting data from API with `fetch`

The rules revolve around creating a consistent API for interacting with reducers
and sagas.

Want to learn more about this style? Check out my other article on
[scaling a react/redux codebase](https://erock.io/scaling-js-codebase-multiple-platforms/)