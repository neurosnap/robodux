import type { Middleware, Next, Ctx } from './types';

export function compose<CurCtx extends Ctx = Ctx>(
  middleware: Middleware<CurCtx>[],
) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  return async function composer(context: CurCtx, next?: Next) {
    // last called middleware #
    let index = -1;
    await dispatch(0);

    async function dispatch(i: number) {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      let fn: any = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return;
      await fn(context, dispatch.bind(null, i + 1));
    }
  };
}
