import createAction from './action';
import createReducer, { NoEmptyArray } from './reducer';
import {
  Action,
  Reducer,
  ActionsObjWithSlice,
  ActionsAny,
  AnyState,
  ReducerMap,
} from './types';

export interface Slice<A = any, SS = any, S = SS, str = ''> {
  slice: SS extends S ? '' : str;
  reducer: Reducer<SS, Action>;
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
  extraActions?: ActionsAny;
}

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

export default function createSlice<
  SliceState,
  Actions extends ActionsAny,
  State extends AnyState
>({
  actions,
  initialState,
  slice,
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
}: InputWithSlice<NoEmptyArray<SliceState>, Actions>): Slice<
  Actions,
  NoEmptyArray<SliceState>,
  AnyState,
  typeof slice
>;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  actions,
  initialState,
  slice,
  extraActions,
}: InputWithSlice<NoEmptyArray<SliceState>, Actions>) {
  if (!slice) {
    throw new Error(`${slice as any} must not be blank`);
  }

  const actionKeys = Object.keys(actions) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(<string>slice);

  const reducerMap = actionKeys.reduce<ReducerMap<SliceState>>(
    (map, action) => {
      (<any>map)[createActionType(<string>action)] = actions[action];
      return map;
    },
    extraActions || {},
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

  return {
    actions: actionMap,
    reducer,
    slice,
  };
}
