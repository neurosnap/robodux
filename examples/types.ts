import robodux from '../src/slice';
import { Action, combineReducers, createStore } from 'redux';

interface SliceState {
  test: string;
  wow: number;
}

interface State {
  hi: SliceState;
  other: boolean;
}

type Actions = {
  set: (p: SliceState) => Action;
  reset: () => Action;
};

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux<SliceState, Actions, State>({
  slice: 'hi',
  actions: {
    set: (state, payload) => payload,
    reset: () => defaultState,
  },
  initialState: defaultState,
});

const val = selectors.getHi({ hi: defaultState, other: true });
actions.set({ test: 'ok', wow: 0 });
actions.reset();
const red = reducer;

console.log(val, red);

interface ISliceState {
  idToken: string;
  userId: string;
  authenticating: boolean;
  error: Error;
}

interface AuthActions {
  authSuccess: (payload: { idToken: string; userId: string }) => Action;
  authStart: () => Action;
  authFail: (error: Error) => Action;
  authLogout: () => Action;
}

interface IState {
  auth: ISliceState;
}

const initialState: ISliceState = {
  idToken: '',
  userId: '',
  authenticating: false,
  error: null,
};

const auth = robodux<ISliceState, AuthActions, IState>({
  slice: 'auth',
  actions: {
    authFail: (state, error) => {
      state.error = error;
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
      state.idToken = payload.idToken;
      state.userId = payload.userId;
    },
  },
  initialState,
});
export const {
  reducer: authReducer,
  slice: authSlice,
  actions: { authFail, authStart, authSuccess, authLogout },
  selectors: { getAuth },
} = auth;

const rootReducer = combineReducers({
  hi: reducer,
  auth: authReducer,
});

const store = createStore(rootReducer);

console.log('[auth object]', auth);
/* 
[auth object]
 { 
   actions: { 
     authFail: { [Function: action] toString: [Function] },
     authLogout: { [Function: action] toString: [Function] },
     authStart: { [Function: action] toString: [Function] },
     authSuccess: { [Function: action] toString: [Function] } 
    },
  reducer: { [Function: reducer] toString: [Function] },
  slice: 'auth',
  selectors: { getAuth: [Function] }
 }
 */
console.log(authLogout());
// [authLogout action creator]
/* 
{ type: 'auth/authLogout', payload: undefined }
*/
console.log(
  authSuccess({ idToken: 'really Long Token', userId: 'Its Me' }),
);
/* 
[authSuccess actionCreator] 
{ 
  type: 'auth/authSuccess',
  payload: { idToken: 'really Long Token', userId: 'Its Me' } 
} 
  */
console.log(authStart());
// [authStart action creator]
/* 
{ type: 'auth/authStart', payload: undefined }
*/

console.log(
  store.dispatch(authStart()),
  getAuth(store.getState()),
);
// '[auth reducer called with undefined state and authStart action]'
/* 
Action: { type: 'auth/authStart', payload: undefined }

New Auth State: { 
  idToken: '',
  userId: '',
  authenticating: true, <- modified by authStart action
  error: null 
}
*/
console.log(
  store.dispatch(
    authSuccess({ idToken: 'really Long Token', userId: 'Its Me' }),
  ),
  getAuth(store.getState()),
);
// [auth reducer called with undefined state and authSuccess action]
/* 
Action: { 
  type: 'auth/authSuccess',
  payload: { 
    idToken: 'really Long Token',
     userId: 'Its Me'
     } 
    }

 New Auth State: {
  idToken: 'really Long Token', <- modified
  userId: 'Its Me',             <- modified
  authenticating: false,        <- modified
  error: null                   <- not modified
}
*/
