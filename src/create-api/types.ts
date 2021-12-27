import { Dispatch } from 'redux';
import type { LoadingMapPayload } from '../create-loader-table';
import type { Action, ActionWithPayload } from '../types';
import { CancelablePromise } from './cancelable';
import type { EventEmitter } from './emitter';

export type Next = () => any;
export type Middleware<CurCtx extends Ctx = Ctx> = (
  ctx: CurCtx,
  next: Next,
) => any;

export type MiddlewareCo<CurCtx extends Ctx> =
  | Middleware<CurCtx>
  | Middleware<CurCtx>[];

export interface CreateActionPayload<CurCtx, P = any> {
  name: string;
  payload: P;
  key: string;
  fn: (store: any, emitter: EventEmitter) => Promise<CurCtx>;
}

export interface PipeCtx<P = any> {
  name: string;
  payload: P;
  action: ActionWithPayload<CreateActionPayload<P>>;
}

export interface CreateAction<CurCtx> {
  (): ActionWithPayload<CreateActionPayload<CurCtx, {}>>;
  toString: () => string;
}
export interface CreateActionWithPayload<CurCtx, P> {
  (p: P): ActionWithPayload<CreateActionPayload<CurCtx, P>>;
  toString: () => string;
}

export type FxStatus =
  | 'idle'
  | 'running'
  | 'cancelled'
  | 'aborted'
  | 'completed';

export interface Ctx<S = any, P = any> {
  name: string;
  key: string;
  dispatch: Dispatch<Action>;
  getState: () => S;
  status: FxStatus;
  payload: P;
  cancel: () => void;
  take: (t: string) => CancelablePromise<Action>;
  signal: AbortSignal;
}

export interface RequestData {
  [key: string]: any;
}

export interface RequestCtx {
  url: string;
  method: string;
  body: any;
  data: RequestData;
  simpleCache: boolean;
}

export interface ApiCtx<R = any, S = any> extends Ctx<S> {
  request: Partial<RequestCtx>;
  response: R;
  actions: Action[];
  loader: LoadingMapPayload<Record<string, any>> | null;
}

export interface FetchApiOpts extends RequestInit {
  url: string;
  data: RequestData;
  simpleCache: boolean;
}

export interface ApiFetchSuccess<Data = any> {
  status: number;
  ok: true;
  data: Data;
}

export interface ApiFetchError<E = any> {
  status: number;
  ok: false;
  data: E;
}

export type ApiFetchResponse<Data = any, E = any> =
  | ApiFetchSuccess<Data>
  | ApiFetchError<E>;

export interface FetchCtx<D = any, P = any, E = any> extends ApiCtx {
  payload: P;
  request: Partial<FetchApiOpts>;
  response: ApiFetchResponse<D, E>;
}

export interface PipeApi<CurCtx extends Ctx = Ctx> {
  use: (fn: Middleware<CurCtx>) => void;
  actions: () => Middleware<CurCtx>;

  create(name: string, fn?: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  create<P>(
    name: string,
    fn?: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;
}

export interface ApiHttpMethods<CurCtx extends ApiCtx = ApiCtx> {
  get(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  get<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  post(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  post<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  put(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  put<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  patch(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  patch<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  delete(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  delete<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  options(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  options<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  head(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  head<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  connect(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  connect<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;

  trace(fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  trace<P>(fn: MiddlewareCo<CurCtx>): CreateActionWithPayload<CurCtx, P>;
}

export interface CreateApi<CurCtx extends ApiCtx = ApiCtx>
  extends PipeApi<CurCtx> {
  request: (r: CurCtx['request']) => Middleware<CurCtx>;
  uri(name: string): ApiHttpMethods<CurCtx>;

  get(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  get<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  post(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  post<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  put(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  put<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  patch(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  patch<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  delete(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  delete<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  options(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  options<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  head(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  head<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  connect(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  connect<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;

  trace(name: string, fn: MiddlewareCo<CurCtx>): CreateAction<CurCtx>;
  trace<P>(
    name: string,
    fn: MiddlewareCo<CurCtx>,
  ): CreateActionWithPayload<CurCtx, P>;
}
