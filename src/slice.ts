import createAction from './action';
import createReducer from './reducer';
import { createSelector, createSelectorName } from './selector';
import { Action } from './types';

type Reduce<State> = (state: State, payload?: any) => State | undefined | void;
interface ReduceMap<State> {
  [key: string]: Reduce<State>;
}
interface ICreate<State, Actions> {
  slice?: string;
  actions: { [key: string]: Reduce<State> };
  initialState: State;
}

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

export default function create<
  SliceState = any,
  Actions = { [key: string]: (p?: any) => Action<any> },
  State = any
>({ slice = '', actions, initialState }: ICreate<SliceState, Actions>) {
  const actionKeys = Object.keys(actions) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(slice);

  const reducerMap = actionKeys.reduce<ReduceMap<SliceState>>((map, action) => {
    map[createActionType(action as string)] = actions[action as string];
    return map;
  }, {});

  const reducer = createReducer<SliceState>({
    initialState,
    actions: reducerMap,
    slice,
  });

  const actionMap = actionKeys.reduce<{ [A in keyof Actions]: Actions[A] }>(
    (map, action) => {
      const type = createActionType(action as string);
      map[action] = createAction(type) as any;
      return map;
    },
    {} as any,
  );

  const selectorName = createSelectorName(slice);
  const selectors = {
    [selectorName]: createSelector<State, SliceState>(slice),
  };

  return {
    actions: actionMap,
    reducer,
    slice,
    selectors,
  };
}
