import type { Action, Dispatch } from 'redux';

import type {
  ApiCtx,
  CreateApi,
  Ctx,
  FxStatus,
  Middleware,
  MiddlewareCo,
  Next,
  PipeApi,
} from './types';
import { compose } from './compose';
import { FX_CALL } from './constants';
import { EventEmitter } from './emitter';
import { cancelable, wrap } from './cancelable';
import { encodeBase64 } from './encoding';

export * from './compose';
export * from './constants';
export * from './middleware';
export * from './slice';
export * from './store';
export * from './types';

function createCtx<S = any>(
  getState: () => S,
  dispatch: Dispatch<Action>,
  emitter: EventEmitter,
  controller: AbortController,
  props: Partial<Ctx> = {},
): Ctx {
  const take = (type: string) =>
    cancelable<Action>((resolve) => {
      const cb = (action: Action) => {
        resolve(action);
      };
      emitter.sub(type, cb);
    });

  const ctx: Ctx = {
    name: '',
    key: '',
    status: 'idle',
    getState,
    dispatch,
    signal: controller.signal,
    take,
    cancel: () => {},
    payload: null,
    ...props,
  };
  ctx.cancel = () => {
    ctx.status = 'cancelled';
    controller.abort();
  };
  return ctx;
}

export function createPipe<
  CurCtx extends Ctx = Ctx,
  S = any,
>(): PipeApi<CurCtx> {
  const middleware: Middleware<CurCtx>[] = [];
  const middlewareMap: { [key: string]: Middleware<CurCtx>[] } = {};
  const statusMap: { [key: string]: FxStatus } = {};

  const fx = async (
    getState: () => S,
    dispatch: Dispatch<Action>,
    emitter: EventEmitter,
    name: string,
    payload: any,
    key: string,
  ): Promise<CurCtx> => {
    const status = statusMap[name] || 'idle';
    const controller = new AbortController();
    const ctx = createCtx(getState, dispatch, emitter, controller, {
      name,
      payload,
      status,
      key,
    });
    const fn = compose<CurCtx>(middleware);
    await wrap(fn(ctx as any), controller);
    return ctx as any;
  };

  return {
    use: (md: Middleware<CurCtx>) => {
      middleware.push(md);
    },
    actions: () => async (ctx: CurCtx, next: Next) => {
      const match = middlewareMap[ctx.name];
      if (!match) {
        await next();
        return;
      }

      const md = compose<CurCtx>(match);
      await md(ctx, next);
    },
    create: (
      name: string,
      md: MiddlewareCo<CurCtx> = async (_, next) => {
        await next();
      },
    ) => {
      const resolvedName = `${name}`;
      if (Array.isArray(md)) {
        middlewareMap[resolvedName] = md;
      } else {
        middlewareMap[resolvedName] = [md];
      }

      const actionFn = (payload?: any) => {
        const key = encodeBase64(
          JSON.stringify({ name: resolvedName, payload }),
        );
        return {
          type: FX_CALL,
          payload: {
            name: resolvedName,
            payload,
            key,
            fn: (store: any, emitter: EventEmitter) =>
              fx(
                store.getState,
                store.dispatch,
                emitter,
                resolvedName,
                payload,
                key,
              ),
          },
        };
      };
      actionFn.toString = () => resolvedName;
      return actionFn;
    },
  };
}

export function createApi<CurCtx extends ApiCtx = ApiCtx>(): CreateApi<CurCtx> {
  const pipe = createPipe<CurCtx>();
  const uri = (name: string) => {
    return {
      get: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [GET]`, md),
      post: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [POST]`, md),
      put: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [PUT]`, md),
      patch: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [PATCH]`, md),
      delete: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [DELETE]`, md),
      options: (md: MiddlewareCo<CurCtx>) =>
        pipe.create(`${name} [OPTIONS]`, md),
      head: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [HEAD]`, md),
      connect: (md: MiddlewareCo<CurCtx>) =>
        pipe.create(`${name} [CONNECT]`, md),
      trace: (md: MiddlewareCo<CurCtx>) => pipe.create(`${name} [TRACE]`, md),
    };
  };
  return {
    ...pipe,
    request: (req: CurCtx['request']) => async (ctx, next) => {
      ctx.request = req;
      await next();
    },
    uri,
    get: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).get(md),
    post: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).post(md),
    put: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).put(md),
    patch: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).patch(md),
    delete: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).delete(md),
    options: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).options(md),
    head: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).head(md),
    connect: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).connect(md),
    trace: (name: string, md: MiddlewareCo<CurCtx>) => uri(name).trace(md),
  };
}
