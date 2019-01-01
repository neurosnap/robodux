import createAction from './action';
import createReducer from './reducer';
import { createSelector, createSelectorName } from './selector';
import { Action } from './types';
import { AnyAction } from 'redux';

// type GetPayloadType<A> = A extends ((payload: infer P) => Action) ? P : A extends ((payload: infer P) => RAction) ? P : A;

type ActionReducer<S = any, A = any> = (
  state: S | undefined,
  payload: A,
) => S | void | undefined;
// type CReducer2<S = any> = (state: S) => S;
type Reducer<SS = any, A = AnyAction> = (
  state: SS | undefined,
  payload: A,
) => SS;

type ActionsObj<SS = any, Ax = any> = {
  [K in keyof Ax]: ActionReducer<SS, Ax[K]>
};

type ActionsAny<P = any> = {
  [Action: string]: P;
};
interface ReduceM<SS> {
  [Action: string]: ActionReducer<SS, AnyAction>;
}
type Result<A extends ActionsAny = ActionsAny, SS = any, S = SS> = {
  slice: string;
  reducer: Reducer<SS, AnyAction>;
  selectors: { [x: string]: (state: S) => SS };
  actions: {
    [key in keyof A]: Object extends A[key]
      ? (payload?: any) => Action
      : A[key] extends never
        ? () => Action
        : (payload: A[key]) => Action<A[key]>
  };
};

type InputWithSlice<SS = any, Ax = ActionsAny> = {
  initialState: SS;
  actions: ActionsObj<SS, Ax>;
  slice?: string;
};
type InputWithoutSlice<SS = any, Ax = ActionsAny> = {
  initialState: SS;
  actions: ActionsObj<SS, Ax>;
};

const actionTypeBuilder = (slice: string) => (action: string) =>
  slice ? `${slice}/${action}` : action;

type NoEmptyObject<S> = Object extends S ? { [slice: string]: any } : S;

export default function create<Actions extends ActionsAny, SliceState>({
  actions,
  initialState,
}: InputWithoutSlice<SliceState, Actions>): Result<Actions, SliceState>;

export default function create<
  Actions extends ActionsAny,
  SliceState,
  State extends {}
>({
  slice,
  actions,
  initialState,
}: InputWithSlice<SliceState, Actions>): Result<
  Actions,
  SliceState,
  NoEmptyObject<State>
>;

export default function create<Actions extends ActionsAny, SliceState, State>({
  slice = '',
  actions,
  initialState,
}: InputWithSlice<SliceState, Actions>) {
  type StateX = NoEmptyObject<State>;
  const actionKeys = Object.keys(actions) as (keyof Actions)[];
  const createActionType = actionTypeBuilder(slice);

  const reducerMap = actionKeys.reduce<ReduceM<SliceState>>((map, action) => {
    (<any>map)[createActionType(<string>action)] = actions[action];
    return map;
  }, {});

  const reducer = createReducer<SliceState>({
    initialState,
    actions: reducerMap,
    slice,
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

  const selectorName = createSelectorName(slice);
  const selectors = {
    [selectorName]: createSelector<StateX, SliceState>(slice),
  };
  return {
    actions: actionMap,
    reducer,
    slice,
    selectors,
  };
}
