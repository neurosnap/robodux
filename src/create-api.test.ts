import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { put } from 'redux-saga/effects';
import createCache from './create-table';
import { Middleware, Next, createApi } from './create-api';
import { Action, MapEntity } from './types';
import { createReducerMap } from './combine';

interface RoboCtx<D = any> {
  request: FetchApiOpts;
  response: D;
  actions: Action[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserResponse {
  id: string;
  name: string;
  email_address: string;
}

const deserializeUser = (u: UserResponse): User => {
  return {
    id: u.id,
    name: u.name,
    email: u.email_address,
  };
};

interface Ticket {
  id: string;
  name: string;
}

interface TicketResponse {
  id: string;
  name: string;
}

const deserializeTicket = (u: TicketResponse): Ticket => {
  return {
    id: u.id,
    name: u.name,
  };
};

const users = createCache<User>({ name: 'USER' });
const tickets = createCache<Ticket>({ name: 'TICKET' });
const reducers = createReducerMap(users, tickets);

interface FetchApiOpts {
  url: RequestInfo;
  options?: RequestInit;
  middleware?: Middleware<RoboCtx>[];
}

const mockUser = { id: '1', name: 'test', email_address: 'test@test.com' };
const mockTicket = { id: '2', name: 'test-ticket' };

function* onFetchApi(ctx: RoboCtx, next: Next) {
  const { url } = ctx.request;
  let json = {};
  if (url === '/users') {
    json = {
      users: [mockUser],
    };
  }

  if (url === '/tickets') {
    json = {
      tickets: [mockTicket],
    };
  }

  ctx.response = json;
  yield next();
}

function* setupActionState(ctx: RoboCtx, next: Next) {
  ctx.actions = [];
  yield next();
}

function* processUsers(ctx: RoboCtx<{ users?: UserResponse[] }>, next: Next) {
  if (!ctx.response.users) {
    yield next();
    return;
  }
  const curUsers = ctx.response.users.reduce<MapEntity<User>>((acc, u) => {
    acc[u.id] = deserializeUser(u);
    return acc;
  }, {});
  ctx.actions.push(users.actions.add(curUsers));
  yield next();
}

function* processTickets(
  ctx: RoboCtx<{ tickets?: UserResponse[] }>,
  next: Next,
) {
  if (!ctx.response.tickets) {
    yield next();
    return;
  }
  const curTickets = ctx.response.tickets.reduce<MapEntity<Ticket>>(
    (acc, u) => {
      acc[u.id] = deserializeTicket(u);
      return acc;
    },
    {},
  );
  ctx.actions.push(tickets.actions.add(curTickets));
  yield next();
}

function* saveToRedux(ctx: RoboCtx, next: Next) {
  for (let i = 0; i < ctx.actions.length; i += 1) {
    const action = ctx.actions[i];
    yield put(action);
  }
  yield next();
}

function setupStore(saga: any) {
  const sagaMiddleware = createSagaMiddleware();
  const reducer = combineReducers(reducers as any);
  const store = createStore(reducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(saga);
  return store;
}

describe('createApi', () => {
  describe('when create a query fetch pipeline', () => {
    it('execute all middleware and save to redux', () => {
      const api = createApi<RoboCtx, FetchApiOpts>('app');
      api.use(onFetchApi);
      api.use(setupActionState);
      api.use(processUsers);
      api.use(processTickets);
      api.use(saveToRedux);
      const fetchUsers = () => api.create({ url: `/users` });

      const store = setupStore(api.saga);
      store.dispatch(fetchUsers());
      expect(store.getState()).toEqual({
        [users.name]: { [mockUser.id]: deserializeUser(mockUser) },
        [tickets.name]: {},
      });
    });
  });

  describe('when providing a generator the to api.create function', () => {
    it('should call that generator before all other middleware', () => {
      const api = createApi<RoboCtx, FetchApiOpts>('app');
      api.use(onFetchApi);
      api.use(setupActionState);
      api.use(processUsers);
      api.use(processTickets);
      api.use(saveToRedux);
      const fetchUsers = () => api.create({ url: `/users` });
      const fetchTickets = () =>
        api.create({ url: `/ticket-wrong-url` }, function*(ctx, next) {
          // before middleware has been triggered
          ctx.request.url = '/tickets';

          // triggers all middleware
          yield next();

          // after middleware has been triggered
          expect(ctx.actions).toEqual([
            tickets.actions.add({
              [mockTicket.id]: deserializeTicket(mockTicket),
            }),
          ]);
          yield put(fetchUsers());
        });

      const store = setupStore(api.saga);
      store.dispatch(fetchTickets());
      expect(store.getState()).toEqual({
        [users.name]: { [mockUser.id]: deserializeUser(mockUser) },
        [tickets.name]: { [mockTicket.id]: deserializeTicket(mockTicket) },
      });
    });
  });
});
