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
  name: SS extends S ? '' : str;
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
  reducts: ActionsObjWithSlice<SS, Ax, S>;
  name: keyof S;
  extraReducers?: ActionsAny;
  useImmer?: boolean;
}

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

export default function createSlice<
  SliceState,
  Actions extends ActionsAny,
  State extends AnyState
>({
  reducts,
  initialState,
  name,
  useImmer,
}: InputWithSlice<NoEmptyArray<SliceState>, Actions, State>): Slice<
  Actions,
  NoEmptyArray<SliceState>,
  State,
  typeof name
>;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  reducts,
  initialState,
  name,
  useImmer,
}: InputWithSlice<NoEmptyArray<SliceState>, Actions>): Slice<
  Actions,
  NoEmptyArray<SliceState>,
  AnyState,
  typeof name
>;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  reducts,
  initialState,
  name,
  extraReducers,
  useImmer = true,
}: InputWithSlice<NoEmptyArray<SliceState>, Actions>) {
  if (!name) {
    throw new Error(`createSlice name must not be blank`);
  }

  const actionKeys = Object.keys(reducts) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(<string>name);

  const reducerMap = actionKeys.reduce<ReducerMap<SliceState>>(
    (map, action) => {
      (<any>map)[createActionType(<string>action)] = reducts[action];
      return map;
    },
    extraReducers || {},
  );

  const reducer = createReducer<SliceState>({
    initialState,
    reducers: reducerMap,
    name: <string>name,
    useImmer,
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
    name,
    toString: () => name,
  };
}
