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
  reset: null;
};

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux<SliceState, Actions, IState>({
  slice: 'hi',
  actions: {
    set: (state, payload) => payload,
    reset: (state) => defaultState,
  },
  initialState: defaultState,
});

const val = selectors.getHi({ hi: defaultState, auth: {} } as IState);
actions.set({ test: 'ok', wow: 0 });
actions.reset();
const red = reducer;

console.log('\nHi selector: ',val,'\nHi reducer', red);

interface ISliceState {
  idToken: string;
  userId: string;
  authenticating: boolean;
  error: Error;
}

interface AuthActions {
  authSuccess: { idToken: string; userId: string };
  authStart: null;
  authFail: Error;
  authLogout: null;
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
  selectors: { getAuth },
} = auth;

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
console.log('[authLogout action creator]\n', authLogout(), '\n');
/* 
[authLogout action creator]
{ type: 'auth/authLogout', payload: undefined }
*/

console.log(
  '[authSuccess actionCreator]\n',
  authSuccess({ idToken: 'really Long Token', userId: "It's Me" }),
  '\n',
);
/* 
[authSuccess actionCreator] 
{ 
  type: 'auth/authSuccess',
  payload: { 
    idToken: 'really Long Token',
    userId: 'It's Me'
    } 
} 
  */

console.log(
  '\n[authStart action dispatched]\n',
  'Action: ',
  store.dispatch(authStart()),
  '\nNew Auth State: ',
  getAuth(store.getState()),
  '\n',
);
/* 
   [authStart action dispatched]

   Action: { type: 'auth/authStart', payload: undefined }
   
   New Auth State: { 
     idToken: '',
     userId: '',
     authenticating: true, <- modified by authStart action
     error: null 
    }
    */

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

/* 
[start: authSuccess action dispatched]
 Action:  { 
  type: 'auth/authSuccess',
  payload: {
    idToken: 'really Long Token',
    userId: 'Its Me'
  }
}

New Auth State:  {
  idToken: 'really Long Token',
  userId: 'Its Me',
  authenticating: false,
  error: null
}
[stop: authSuccess action dispatched]

*** You've logged in successfully!***
*/

console.log(
  '\n[Thunk dispatched]\n',
  '\nAction: ',
  store.dispatch(thunkAuthLogout() as any),
  '\nUnchanged Auth State: ',
  getAuth(store.getState()),
  '\n***************\n',
);
/* 
[Thunk dispatched]

Action:  undefined

Unchanged Auth State: {
  idToken: 'really Long Token',
  userId: 'Its Me',
  authenticating: false,
  error: null
}

***************


**AFTER A DELAY OF 15 SECONDS**


Thunk!!!

 You've been logged out!
 
  */
