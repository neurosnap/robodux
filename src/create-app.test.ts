import createApp from './create-app';
import assignSlice from './slice-assign';
import { createReducerMap } from './combine';

describe('createApp', () => {
  it('should return a function', () => {
    const slice = assignSlice({ name: 'test', initialState: false });
    const reducers = createReducerMap(slice);
    const mod = { reducers };
    const actual = createApp([mod]);
    expect(typeof actual.reducer).toEqual('function');
  });

  it('should return state', () => {
    interface State {
      you: string;
    }
    interface Actions {
      setTest: State;
    }
    const slice = assignSlice<State, Actions>({
      name: 'test',
      initialState: { you: 'me' },
    });
    const reducers = createReducerMap(slice);
    const mod = { reducers };
    const app = createApp([mod]);
    const actual = app.reducer;
    expect(
      actual(undefined, {
        type: `${slice.actions.setTest}`,
        payload: { test: { you: 'we' } },
      }),
    ).toEqual({ test: { test: { you: 'we' } } });
  });
});
