import { call, takeEvery } from 'redux-saga/effects';
import createAction from './create-action';
import { ActionWithPayload } from './types';

export type Middleware<Ctx = any> = (ctx: Ctx, next: Next) => any;
export type Next = () => any;

function compose<Ctx = any>(middleware: Middleware<Ctx>[]) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  return function* composeSaga(context: Ctx, next?: Next) {
    // last called middleware #
    let index = -1;
    yield call(dispatch, 0);

    function* dispatch(i: number): any {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      let fn: any = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return;
      yield call(fn, context, dispatch.bind(null, i + 1));
    }
  };
}

export const API_ACTION_PREFIX = '@@robodux/api';
export function createApi<
  Ctx = any,
  A extends { middleware?: Middleware<Ctx>[] } = {
    middleware: Middleware<Ctx>[];
  }
>(name: string) {
  const middleware: Middleware<Ctx>[] = [];
  const action = createAction<A>(`${API_ACTION_PREFIX}/${name}`);
  function* onApi(action: ActionWithPayload<A>) {
    const { middleware: curMiddleware } = action.payload;
    const ctx: any = {
      request: action.payload,
    };
    const fn = compose(curMiddleware as any);
    yield call(fn, ctx);
  }

  function* saga() {
    yield takeEvery(`${action}`, onApi);
  }

  return {
    action,
    saga,
    use: (fn: Middleware<Ctx>) => {
      middleware.push(fn);
    },
    create: (req: A, fn?: Middleware<Ctx>) => {
      return action({
        ...req,
        middleware: fn ? [fn, ...middleware] : [...middleware],
      });
    },
  };
}
