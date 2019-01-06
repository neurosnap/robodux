import createAction from './action';
import createReducer, { NoEmptyArray } from './reducer';
import { createSelector } from './selector';
import { Action } from './types';

type ActionReducer<SS = any, A = any> = (
  state: SS,
  payload: A,
) => SS | void | undefined;

type ActionReducerWithSlice<SS = any, A = any, S = any> = (
  state: SS,
  payload: A,
  _FullState: S, // Third argument can be used to type cast State
) => SS | void | undefined;

export type Reducer<SS = any, A extends Action = Action> = (
  state: SS | undefined,
  payload: A,
) => SS;

type ActionsObj<SS = any, Ax = any> = {
  [K in keyof Ax]: ActionReducer<SS, Ax[K]>
};
type ActionsObjWithSlice<SS = any, Ax = any, S = any> = {
  [K in keyof Ax]: ActionReducerWithSlice<SS, Ax[K], S>
};

interface ActionsAny<P = any> {
  [Action: string]: P;
}
export interface AnyState {
  [slice: string]: any;
}

export interface ReducerMap<SS, A = Action> {
  [Action: string]: ActionReducer<SS, A>;
}

export interface Slice<A = any, SS = any, S = SS, str = ''> {
  slice: SS extends S ? '' : str;
  reducer: Reducer<SS, Action>;
  selectors: {
    getSlice: (state: S) => SS;
  };
  actions: {
    [key in keyof A]: Object extends A[key] // ensures payload isn't inferred as {}
      ? (payload?: any) => Action
      : A[key] extends never
      ? () => Action
      : (payload: A[key]) => Action<A[key]>
  };
}

interface InputWithSlice<SS = any, Ax = ActionsAny, S = any> {
  initialState: SS;
  actions: ActionsObjWithSlice<SS, Ax, S>;
  slice: keyof S;
}
interface InputWithoutSlice<SS = any, Ax = ActionsAny> {
  initialState: SS;
  actions: ActionsObj<SS, Ax>;
}
interface InputWithBlankSlice<SS = any, Ax = ActionsAny> {
  initialState: SS;
  actions: ActionsObj<SS, Ax>;
  slice: '';
}
interface InputWithOptionalSlice<SS = any, Ax = ActionsAny, S = any> {
  initialState: SS;
  actions: ActionsObjWithSlice<SS, Ax, S>;
  slice?: keyof S;
}

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;
//#region

export default function createSlice<
  SliceState,
  Actions extends ActionsAny,
  State extends AnyState
>({
  slice,
  actions,
  initialState,
}: InputWithSlice<NoEmptyArray<SliceState>, Actions, State>): Slice<
  Actions,
  NoEmptyArray<SliceState>,
  State,
  typeof slice
>;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  actions,
  initialState,
  slice,
}: InputWithBlankSlice<NoEmptyArray<SliceState>, Actions>): Slice<
  Actions,
  NoEmptyArray<SliceState>,
  NoEmptyArray<SliceState>,
  typeof slice
>;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  actions,
  initialState,
}: InputWithoutSlice<NoEmptyArray<SliceState>, Actions>): Slice<
  Actions,
  NoEmptyArray<SliceState>
>;

export default function createSlice<
  SliceState,
  Actions extends ActionsAny,
  State extends AnyState
>({
  actions,
  initialState,
  slice = '',
}: InputWithOptionalSlice<NoEmptyArray<SliceState>, Actions, State>) {
  const actionKeys = Object.keys(actions) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(<string>slice);

  const reducerMap = actionKeys.reduce<ReducerMap<SliceState>>(
    (map, action) => {
      (<any>map)[createActionType(<string>action)] = actions[action];
      return map;
    },
    {},
  );

  const reducer = createReducer<SliceState>({
    initialState,
    actions: reducerMap,
    slice: <string>slice,
  });

  const actionMap = actionKeys.reduce<
    {
      [key in keyof Actions]: Object extends Actions[key]
        ? (payload?: any) => Action
        : Actions[key] extends never
        ? () => Action
        : (payload: Actions[key]) => Action<Actions[key]>
    }
  >(
    (map, action) => {
      const type = createActionType(action as string);
      map[action] = createAction(type) as any;
      return map;
    },
    {} as any,
  );

  const selectors = {
    getSlice: createSelector<State, SliceState>(<string>slice),
  };
  return {
    actions: actionMap,
    reducer,
    slice,
    selectors,
  };
}
