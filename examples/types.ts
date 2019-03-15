import robodux from '../src/slice';
import { combineReducers, createStore, applyMiddleware, Dispatch } from 'redux';
import thunk from 'redux-thunk';

interface SliceState {
  test: string;
  wow: number;
}

interface IState {
  hi: SliceState;
  auth: ISliceState;
}

type Actions = {
  set: SliceState;
  reset: never;
};

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, reducer, slice } = robodux<SliceState, Actions, IState>({
  slice: 'hi',
  actions: {
    set: (state, payload) => payload,
    reset: (state) => defaultState,
  },
  initialState: defaultState,
});

const val = { hi: defaultState, auth: {} }[slice];
actions.set({ test: 'ok', wow: 0 });
actions.reset();
const red = reducer;

console.log('\n\nHi selector: ', val, '\n\nHi reducer', red);

interface ISliceState {
  idToken: string;
  userId: string;
  authenticating: boolean;
  error: Error;
}

interface AuthActions {
  authSuccess: { idToken: string; userId: string };
  authStart: never;
  authFail: Error;
  authLogout: never;
}

const initialState: ISliceState = {
  idToken: '',
  userId: '',
  authenticating: false,
  error: null,
};

const auth = robodux<ISliceState, AuthActions, IState>({
  slice: 'auth', // slice is checked to ensure it is a key in IState
  actions: {
    authFail: (state, payload) => {
      state.error = payload;
      state.authenticating = false;
    },
    authLogout: (state) => {
      state.idToken = null;
      state.userId = null;
    },
    authStart: (state) => {
      state.authenticating = true;
    },
    authSuccess: (state, payload) => {
      state.authenticating = false;
      state.idToken = payload.idToken;
      state.userId = payload.userId;
    },
  },
  initialState,
});

// You can destructure and export the reducer, action creators and selectors
export const {
  reducer: authReducer,
  slice: authSlice,
  actions: { authFail, authStart, authSuccess, authLogout },
} = auth;

const authWithoutInterface = robodux({
  slice: 'auth',
  actions: {
    authFail2: (state, payload: Error) => {
      state.error = payload;
      state.authenticating = false;
    },
    authLogout2: (state, payload: never, _: IState) => {
      // useless third arg can be used to type cast State
      state.idToken = null;
      state.userId = null;
    },
    authStart2: (state, payload: never) => {
      state.authenticating = true;
    },
    authSuccess2: (state, payload: { idToken: string; userId: string }) => {
      state.authenticating = false;
      state.idToken = payload.idToken;
      state.userId = payload.userId;
    },
  },
  initialState,
});

// You can destructure and export the reducer, action creators and selectors
export const {
  reducer: authReducer2,
  slice: authSlice2,
  actions: { authFail2, authStart2, authSuccess2, authLogout2 },
} = authWithoutInterface;

const rootReducer = combineReducers<IState>({
  hi: reducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const thunkAuthLogout = () => (dispatch: Dispatch, getState: () => IState) => {
  setTimeout(() => {
    dispatch(authLogout());
    console.log("\n\nThunk!!!\n\n You've been logged out!");
  }, 15000);
};

console.log('\n\n[auth object]\n', auth, '\n\n');

console.log('[authLogout action creator]\n', authLogout(), '\n');

console.log(
  '[authSuccess actionCreator]\n',
  authSuccess({ idToken: 'really Long Token', userId: "It's Me" }),
  '\n',
);

const getAuth = (state) => state[authSlice];

console.log(
  '\n[authStart action dispatched]\n',
  'Action: ',
  store.dispatch(authStart()),
  '\nNew Auth State: ',
  getAuth(store.getState()),
  '\n',
);

console.log(
  '\n[start: authSuccess action dispatched]\n',
  'Action: ',
  store.dispatch(
    authSuccess({ idToken: 'really Long Token', userId: 'Its Me' }),
  ),
  '\nNew Auth State: ',
  getAuth(store.getState()),
  '\n[stop: authSuccess action dispatched]\n',
  "\n*** You've logged in successfully!***\n",
);

console.log(
  '\n[Thunk dispatched]\n',
  '\nAction: ',
  store.dispatch(thunkAuthLogout() as any),
  '\nUnchanged Auth State: ',
  getAuth(store.getState()),
  '\n***************\n',
);
