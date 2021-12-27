import { createReducerMap } from '../combine';
import type { MapEntity } from '../types';
import createTable from '../create-table';

import { createApi, createPipe } from '.';
import { setupStore } from './store';
import {
  requestMonitor,
  requestParser,
  delay,
  undoer,
  undo,
} from './middleware';
import type { UndoCtx } from './middleware';
import type { Ctx, FetchCtx } from './types';
import { createQueryState, DATA_NAME, LOADERS_NAME } from './slice';
import { defaultLoadingItem } from '../create-loader';

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUser: User = { id: '1', name: 'test', email: 'test@test.com' };

interface TestStore {
  subscribe: (fn: () => any) => any;
}

interface FnCtx extends Ctx {
  request: Partial<{ method: string; body: { [key: string]: any } }>;
}

const waitForStore = (store: TestStore, n: number) =>
  new Promise<void>((resolve) => {
    let counter = 0;
    store.subscribe(() => {
      counter += 1;
      if (counter === n) {
        resolve();
      }
    });
  });

describe('createPipe', () => {
  test('middleware - order of execution', async () => {
    let acc = '';
    const api = createPipe();
    api.use(api.actions());

    api.use(async (_, next) => {
      await delay(10);
      acc += 'b';
      await next();
      await delay(10);
      acc += 'f';
    });

    api.use(async (_, next) => {
      acc += 'c';
      await next();
      acc += 'd';
      await delay(30);
      acc += 'e';
    });

    const action = api.create('/api', async (_, next) => {
      acc += 'a';
      await next();
      acc += 'g';
    });

    const store = setupStore();
    await store.dispatch(action());

    expect(acc).toEqual('abcdefg');
  });

  test('middleware - error handling', (done) => {
    const api = createPipe();
    api.use(api.actions());
    api.use(async (_, next) => {
      try {
        await next();
      } catch (err) {
        expect(err.message).toEqual('some error');
        done();
      }
    });
    api.use(async () => {
      throw new Error('some error');
    });

    const action = api.create('/error');
    const store = setupStore();
    store.dispatch(action());
  });

  test('action() - error handling', (done) => {
    const api = createPipe();
    api.use(api.actions());
    api.use(async () => {
      throw new Error('some error');
    });

    const action = api.create(`/error`, async (_, next) => {
      try {
        await next();
      } catch (err) {
        expect(err.message).toEqual('some error');
        done();
      }
    });
    const store = setupStore();
    store.dispatch(action());
  });

  test('action() - middleware array', () => {
    const api = createPipe<FnCtx>();
    api.use(api.actions());
    api.use(async (ctx, next) => {
      expect(ctx.request).toEqual({
        method: 'POST',
        body: {
          test: 'me',
        },
      });
      await next();
    });

    const action = api.create('/users', [
      async (ctx, next) => {
        ctx.request = {
          method: 'POST',
        };
        await next();
      },
      async (ctx, next) => {
        ctx.request.body = { test: 'me' };
        await next();
      },
    ]);

    const store = setupStore();
    store.dispatch(action());
  });

  test('undo', async () => {
    const api = createPipe<UndoCtx>();
    api.use(requestMonitor());
    api.use(api.actions());
    api.use(undoer());

    api.use(async (ctx, next) => {
      await delay(500);
      ctx.response = {
        status: 200,
        ok: true,
        data: {
          users: [mockUser],
        },
      };
      await next();
    });

    const createUser = api.create('/users', async (ctx, next) => {
      ctx.undoable = true;
      await next();
    });

    const store = setupStore();
    store.dispatch(createUser());
    store.dispatch(undo());
    await delay(100);

    expect(store.getState()).toEqual({
      ...createQueryState({
        [LOADERS_NAME]: { [`${createUser}`]: defaultLoadingItem() },
      }),
    });
  });
});

describe('createApi', () => {
  test('simple post', async () => {
    const name = 'users';
    const cache = createTable<User>({ name });
    const api = createApi<FetchCtx>();

    api.use(requestMonitor());
    api.use(api.actions());
    api.use(requestParser());
    api.use(async (ctx, next) => {
      expect(ctx.request).toEqual({
        url: '/users',
        method: 'POST',
        body: JSON.stringify({ email: mockUser.email }),
      });
      const data = {
        users: [mockUser],
      };
      ctx.response = { status: 200, ok: true, data };
      await next();
    });

    const usersApi = api.uri('/users');
    const createUser = usersApi.post<{ email: string }>(
      async (ctx: FetchCtx<{ users: User[] }, { email: string }>, next) => {
        ctx.request = {
          method: 'POST',
          body: JSON.stringify({ email: ctx.payload.email }),
        };
        await next();
        if (!ctx.response.ok) return;
        const { users } = ctx.response.data;
        const curUsers = users.reduce<MapEntity<User>>((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});
        ctx.dispatch(cache.actions.add(curUsers));
      },
    );

    const reducers = createReducerMap(cache);
    const store = setupStore(reducers);
    store.dispatch(createUser({ email: mockUser.email }));

    await waitForStore(store, 2);

    expect(store.getState()).toEqual(
      expect.objectContaining({
        '@@robodux/loaders': {
          [`${createUser}`]: expect.objectContaining({
            status: 'success',
          }),
        },
        users: {
          1: {
            id: '1',
            name: 'test',
            email: 'test@test.com',
          },
        },
      }),
    );
  });

  test('request fn', (done) => {
    const api = createApi();
    api.use(requestMonitor());
    api.use(api.actions());
    api.use(requestParser());
    api.use(async (ctx) => {
      expect(ctx.request).toEqual({ method: 'POST', url: '/users' });
      done();
    });
    const createUser = api.create('/users', api.request({ method: 'POST' }));
    const store = setupStore();
    store.dispatch(createUser());
  });

  test('dependent queries', (done) => {
    const api = createApi();
    api.use(api.actions());
    let acc = '';
    const userApi = api.uri('/users/:id');
    const action1 = userApi.get<{ id: string }>(async (_, next) => {
      await next();
      acc += 'a';
    });
    const action2 = userApi.post(async (ctx, next) => {
      await next();
      await ctx.dispatch(action1({ id: '1' }));
      acc += 'b';
      expect(acc).toEqual('ab');
      done();
    });

    const store = setupStore();
    store.dispatch(action2());
  });

  test('simpleCache', async () => {
    const api = createApi<FetchCtx>();
    api.use(requestMonitor());
    api.use(api.actions());
    api.use(requestParser());
    api.use(async (ctx, next) => {
      ctx.response = {
        status: 200,
        ok: true,
        data: {
          users: [mockUser],
        },
      };
      await next();
    });

    const fetchUsers = api.get('/users', api.request({ simpleCache: true }));
    const store = setupStore();

    const action = fetchUsers();
    await store.dispatch(action);

    expect(store.getState()).toEqual(
      expect.objectContaining({
        [DATA_NAME]: {
          [action.payload.key]: { users: [mockUser] },
        },
        [LOADERS_NAME]: {
          [`${fetchUsers}`]: expect.objectContaining({
            status: 'success',
          }),
        },
      }),
    );
  });
});
