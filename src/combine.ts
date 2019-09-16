import { Reducer, Action } from './types';

type MergeIntersections<T> = T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export function combine<A>(a: A): MergeIntersections<A>;
export function combine<A, B>(a: A, b: B): MergeIntersections<A & B>;
export function combine<A, B, C>(
  a: A,
  b: B,
  c: C,
): MergeIntersections<A & B & C>;
export function combine<A, B, C, D>(
  a: A,
  b: B,
  c: C,
  d: D,
): MergeIntersections<A & B & C & D>;
export function combine<A, B, C, D, E>(
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
): MergeIntersections<A & B & C & D & E>;
export function combine(...args: any[]): any {
  const newObj: any = {};
  for (const obj of args) {
    for (const key in obj) {
      if (newObj.hasOwnProperty(key)) {
        console.warn(`collision detected: ${key} already exists`, args);
      }
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

interface TSlice<A = any, SS = any> {
  actions: { [K in keyof A]: A[K] };
  reducer: Reducer<SS, Action>;
  name: string;
}

export function createActionMap<A>(a: TSlice<A>): MergeIntersections<A>;
export function createActionMap<A, B>(
  a: TSlice<A>,
  b: TSlice<B>,
): MergeIntersections<A & B>;
export function createActionMap<A, B, C>(
  a: TSlice<A>,
  b: TSlice<B>,
  c: TSlice<C>,
): MergeIntersections<A & B & C>;
export function createActionMap<A, B, C, D>(
  a: TSlice<A>,
  b: TSlice<B>,
  c: TSlice<C>,
  d: TSlice<D>,
): MergeIntersections<A & B & C & D>;
export function createActionMap<A, B, C, D, E>(
  a: TSlice<A>,
  b: TSlice<B>,
  c: TSlice<C>,
  d: TSlice<D>,
  e: TSlice<E>,
): MergeIntersections<A & B & C & D & E>;
export function createActionMap(...args: any[]): any {
  return args.reduce((acc, slice) => {
    return combine(acc, slice.actions);
  }, {});
}

export function createReducerMap<
  KV extends Array<{ name: P; reducer: Reducer }>,
  P extends keyof any
>(
  ...args: KV
): { [K in KV[number]['name']]: Extract<KV[number], { name: K }>['reducer'] };
export function createReducerMap(...args: any[]): any {
  return args.reduce((acc, slice) => {
    if (acc.hasOwnProperty(slice.name)) {
      console.warn(`Reducer collision detected: ${slice.name} already exists`);
    }
    acc[slice.name] = slice.reducer;
    return acc;
  }, {});
}
