import createAction from './action';
import createReducer from './reducer';
import { createSelector, createSelectorName } from './selector';
import { Action } from './types';
import { Action as RAction} from 'redux';

type GetPayloadType<A> = A extends ((payload: infer P) => Action) ? P : A extends ((payload: infer P) => RAction) ? P : A;

type Reduce<State,ActionsMethod = never> = (state: State, payload?: GetPayloadType<ActionsMethod>) => State | undefined | void;
interface ReduceMap<State> {
  [key: string]: Reduce<State>;
}
interface ICreate<State, Actions> {
  slice?: string;
  actions: { [key in keyof Actions]: Reduce<State, Actions[key]> };
  initialState: State;
}

interface ActionsObject { [key: string]: (p?: any) => Action | RAction; }
const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

export default function create<
  SliceState,
  Actions = ActionsObject,
  State = any,
>({ slice ='', actions, initialState }: ICreate<SliceState, Actions>) {
  const actionKeys = Object.keys(actions) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(slice);

  const reducerMap = actionKeys.reduce<ReduceMap<SliceState>>((map, action) => {
    map[createActionType(action as string)] = actions[action];
    return map;
  }, {});

  const reducer = createReducer<SliceState>({
    initialState,
    actions: reducerMap,
    slice,
  });

  const actionMap = actionKeys.reduce<{ [A in keyof Actions]: Actions[A]  extends Function ? Actions[A] : (p?: any) => Action | RAction}>(
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
    actions: actionMap ,
    reducer,
    slice,
    selectors,
  };
}
