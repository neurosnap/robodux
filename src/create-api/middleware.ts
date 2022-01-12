import { batchActions } from 'redux-batched-actions';

import createAction from '../create-action';
import type { Action, ActionWithPayload } from '../types';

import type { ApiCtx, Ctx, Next } from './types';
import { compose } from './compose';
import {
  addData,
  resetLoaderById,
  setLoaderError,
  setLoaderStart,
  setLoaderSuccess,
} from './slice';
import { FX_CALL } from './constants';
import { EventEmitter } from './emitter';
import { cancelable } from './cancelable';
import type { CancelablePromise } from './cancelable';

export const isObject = (obj?: any) => typeof obj === 'object' && obj !== null;

export const delay = (n: number) =>
  cancelable((resolve, _, onCancel) => {
    const timer = setTimeout(() => {
      resolve();
    }, n);

    onCancel(() => {
      clearTimeout(timer);
    });
  });

export async function race(promises: CancelablePromise<any>[]) {
  const cancel = () => {
    promises.forEach((p) => {
      p.cancel();
    });
  };

  let winner;
  try {
    winner = await Promise.race(promises);
    cancel();
  } catch (err) {
    cancel();
  }
  return winner;
}

export const createMiddleware = () => {
  const emitter = new EventEmitter();

  return (store: any) =>
    (next: (a: ActionWithPayload) => any) =>
    (action: ActionWithPayload) => {
      emitter.emit(action);

      if (action.type === FX_CALL) {
        return action.payload.fn(store, emitter);
      }

      const result = next(action);
      return result;
    };
};

export async function queryCtx(ctx: ApiCtx, next: Next) {
  if (!ctx.request) ctx.request = { url: '', method: 'GET' };
  if (!ctx.response) ctx.response = {};
  if (!ctx.actions) ctx.actions = [];
  await next();
}

export async function errorHandler(ctx: Ctx, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error(
      `Error: ${err.message}.  Check the endpoint [${ctx.name}]`,
      ctx,
    );
    throw err;
  }
}

export async function urlParser(ctx: ApiCtx, next: Next) {
  const httpMethods = [
    'get',
    'head',
    'post',
    'put',
    'delete',
    'connect',
    'options',
    'trace',
    'patch',
  ];

  const options = ctx.payload || {};
  if (!isObject(options)) {
    await next();
    return;
  }

  if (!ctx.request) throw new Error('ctx.request does not exist');
  if (!ctx.request.url) {
    let url = Object.keys(options).reduce((acc, key) => {
      return acc.replace(`:${key}`, options[key as any]);
    }, ctx.name);

    url = httpMethods.reduce((acc, method) => {
      const pattern = new RegExp(`\\s*\\[` + method + `\\]\\s*`, 'i');
      const result = acc.replace(pattern, '');
      if (result.length !== acc.length) {
        ctx.request.method = method.toLocaleUpperCase();
      }
      return result;
    }, url);
    ctx.request.url = url;
  }

  // TODO: should this be a separate middleware?
  if (!ctx.request.body && ctx.request.data) {
    ctx.request.body = {
      body: JSON.stringify(ctx.request.data),
    };
  }

  if (!ctx.request.method) {
    httpMethods.forEach((method) => {
      const url = ctx.request.url || '';
      const pattern = new RegExp(`\\s*\\[` + method + `\\]\\s*`, 'i');
      const result = url.replace(pattern, '');
      if (result.length !== url.length) {
        ctx.request.method = method.toLocaleUpperCase();
      }
    });
  }

  await next();
}

export async function dispatchActions(
  ctx: { actions: Action[]; dispatch: (a: Action) => any },
  next: Next,
) {
  await next();
  if (ctx.actions.length === 0) return;
  ctx.dispatch(batchActions(ctx.actions));
}

export function loadingMonitor(
  errorFn: (ctx: any) => string = (ctx) => ctx.response?.data?.message || '',
) {
  return async function trackLoading(ctx: ApiCtx, next: Next) {
    const id = ctx.name;
    ctx.dispatch(setLoaderStart({ id }));

    if (!ctx.loader) ctx.loader = {} as any;

    await next();

    if (typeof ctx.response.ok === 'undefined') {
      ctx.actions.push(resetLoaderById(id));
      return;
    }

    const payload = ctx.loader || {};
    if (!ctx.response.ok) {
      ctx.actions.push(
        setLoaderError({ id, message: errorFn(ctx), ...payload }),
      );
      return;
    }

    ctx.actions.push(setLoaderSuccess({ id, ...payload }));
  };
}

export async function simpleCache(ctx: ApiCtx, next: Next) {
  await next();
  if (!ctx.request.simpleCache) return;
  const { data } = ctx.response;
  ctx.actions.push(addData({ [ctx.key]: data }));
}

export function requestMonitor(errorFn?: (ctx: ApiCtx) => string) {
  return compose<ApiCtx>([
    errorHandler,
    queryCtx,
    dispatchActions,
    loadingMonitor(errorFn),
  ]);
}

export function requestParser() {
  return compose<ApiCtx>([urlParser, simpleCache]);
}

export async function takeLeading(ctx: Ctx, next: Next) {
  if (ctx.status === 'running') {
    return;
  }

  ctx.status = 'running';

  try {
    await next();
    ctx.status = 'completed';
  } catch (err) {
    ctx.status = 'aborted';
  }
}

export interface OptimisticCtx<A extends Action = any, R extends Action = any>
  extends ApiCtx {
  optimistic: {
    apply: A;
    revert: R;
  };
}

export async function optimistic<
  Ctx extends OptimisticCtx<any, any> = OptimisticCtx<any, any>,
>(ctx: Ctx, next: Next) {
  if (!ctx.optimistic) {
    await next();
    return;
  }

  const { apply, revert } = ctx.optimistic;
  // optimistically update user
  ctx.dispatch(apply);

  await next();

  if (!ctx.response.ok) {
    ctx.dispatch(revert);
  }
}

export function timer<CurCtx extends Ctx = Ctx>(curTimer: number = 60 * 1000) {
  let lastCalled: null | number = null;
  return async (_: CurCtx, next: Next) => {
    const now = new Date().getTime();
    if (lastCalled && now < lastCalled + curTimer) {
      return;
    }
    lastCalled = new Date().getTime();
    await next();
  };
}

export interface UndoCtx<R = any, P = any> extends ApiCtx<R, P> {
  undoable: boolean;
}

export const doIt = createAction('DO_IT');
export const undo = createAction('UNDO');
export function undoer<Ctx extends UndoCtx = UndoCtx>(
  doItType = `${doIt}`,
  undoType = `${undo}`,
  timeout = 30 * 1000,
) {
  return async (ctx: Ctx, next: Next) => {
    if (!ctx.undoable) {
      await next();
      return;
    }

    const winner = await race([
      ctx.take(`${doItType}`),
      ctx.take(`${undoType}`),
      delay(timeout),
    ]);

    if (!winner) return;
    if (winner.type === `${undoType}`) return;

    await next();
  };
}
