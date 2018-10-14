import robodux from '../src/slice';
import { Action } from 'redux';

interface SliceState {
  test: string;
  wow: number;
}

interface State {
  hi: SliceState;
  other: boolean;
}

type Actions = {
  set: (p: SliceState) => Action;
  reset: () => Action;
};

const defaultState = {
  test: '',
  wow: 0,
};

const { actions, selectors, reducer } = robodux<SliceState, Actions, State>({
  slice: 'hi',
  actions: {
    set: (state: SliceState, payload: SliceState) => payload,
    reset: () => defaultState,
  },
  initialState: defaultState,
});

const val = selectors.getHi({ hi: defaultState, other: true });
actions.set({ test: 'ok', wow: 0 });
actions.reset();
const red = reducer;
