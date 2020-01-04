import { Reducer } from 'redux';

import createAction from './action';
import createReducer from './reducer';
import { Action, ActionsObjWithSlice, ActionsAny, ReducerMap } from './types';

interface SliceOptions<SliceState = any, Ax = ActionsAny> {
  initialState: SliceState;
  reducts: ActionsObjWithSlice<SliceState, Ax>;
  name: string;
  extraReducers?: ActionsAny;
  useImmer?: boolean;
}

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

export default function createSlice<SliceState, Actions extends ActionsAny>({
  reducts,
  initialState,
  name,
  extraReducers,
  useImmer = true,
}: SliceOptions<SliceState, Actions>): {
  name: string;
  reducer: Reducer<SliceState, Action>;
  actions: {
    [key in keyof Actions]: Object extends Actions[key] // ensures payload isn't inferred as {}
      ? (payload?: any) => Action
      : Actions[key] extends never
      ? () => Action
      : (payload: Actions[key]) => Action<Actions[key]>;
  };
  toString: () => string;
} {
  if (!name) {
    throw new Error(`createSlice name must not be blank`);
  }

  const actionKeys = Object.keys(reducts) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(name as string);

  const reducerMap = actionKeys.reduce<ReducerMap<SliceState>>(
    (map, action) => {
      (map as any)[createActionType(action as string)] = reducts[action];
      return map;
    },
    extraReducers || {},
  );

  const reducer = createReducer<SliceState>({
    initialState,
    reducers: reducerMap,
    name,
    useImmer,
  });

  const actionMap = actionKeys.reduce<
    {
      [key in keyof Actions]: Object extends Actions[key] // ensures payload isn't inferred as {}
        ? (payload?: any) => Action
        : Actions[key] extends never
        ? () => Action
        : (payload: Actions[key]) => Action<Actions[key]>;
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
