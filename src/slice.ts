import createAction from './action';
import createReducer from './reducer';
import { createSelector, createSelectorName } from './selector';

type Reduce<State> = (state: State, payload?: any) => State;
interface ReduceMap<State> {
  [key: string]: Reduce<State>;
}
interface ICreate<State, Actions> {
  slice?: string;
  actions: Record<keyof Actions, Reduce<State>>;
  initialState: State;
}

const getType = (slice: string, action: string) =>
  slice ? `${slice}/${action}` : action;

export default function create<SliceState, Actions = any, State = any>({
  slice = '',
  actions,
  initialState,
}: ICreate<SliceState, Actions>) {
  const actionKeys = Object.keys(actions) as (keyof Actions)[];

  const reducerMap = actionKeys.reduce<ReduceMap<SliceState>>(
    (map: ReduceMap<SliceState>, action) => {
      map[getType(slice, action as string)] = actions[action];
      return map;
    },
    {},
  );

  const reducer = createReducer<SliceState>({
    initialState,
    actions: reducerMap,
  });

  const actionMap = actionKeys.reduce<Actions>(
    (map: Actions, action) => {
      const type = getType(slice, action as string);
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
