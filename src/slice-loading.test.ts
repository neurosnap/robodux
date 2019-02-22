import loadingSlice from './slice-loading';

interface State {
  [key: string]: string;
}

interface Actions {
  loading: never;
  loadingSuccess: never;
  loadingError: string;
}

describe('loadingSlice', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      const slice = 'loading';
      const { reducer, actions } = loadingSlice<Actions, State>({ slice });
      const state = { error: '', loading: false, success: false };
      const actual = reducer(state, actions.loading());

      expect(actual).toEqual({
        loading: true,
        error: '',
        success: false,
      });
    });
  });

  describe('success', () => {
    it('should set the state to loading', () => {
      const slice = 'loading';
      const { reducer, actions } = loadingSlice<Actions, State>({ slice });
      const state = { error: '', loading: true, success: false };
      const actual = reducer(state, actions.loadingSuccess());

      expect(actual).toEqual({
        loading: false,
        error: '',
        success: true,
      });
    });
  });

  describe('error', () => {
    const slice = 'loading';
    const { reducer, actions } = loadingSlice<Actions, State>({ slice });
    const state = { error: '', loading: true, success: false };
    const actual = reducer(state, actions.loadingError('some error'));

    expect(actual).toEqual({
      loading: false,
      error: 'some error',
      success: false,
    });
  });
});
