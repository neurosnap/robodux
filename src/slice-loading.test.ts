import loadingSlice from './slice-loading';

interface State {
  [key: string]: string;
}

interface Actions {
  loading: string;
  loadingSuccess: string;
  loadingError: string;
}

describe('loadingSlice', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      interface OtherActions {
        loading: never;
      }
      const name = 'loading';
      const { reducer, actions } = loadingSlice<OtherActions, State>({ name });
      const state = { error: '', message: '', loading: false, success: false };
      const actual = reducer(state, actions.loading());

      expect(actual).toEqual({
        loading: true,
        error: '',
        message: '',
        success: false,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice<Actions, State>({ name });
      const state = { error: '', message: '', loading: false, success: false };
      const actual = reducer(state, actions.loading('hi there'));

      expect(actual).toEqual({
        loading: true,
        error: '',
        message: 'hi there',
        success: false,
      });
    });
  });

  describe('success', () => {
    it('should set the state to loading', () => {
      interface OtherActions {
        loadingSuccess: never;
      }
      const name = 'loading';
      const { reducer, actions } = loadingSlice<OtherActions, State>({ name });
      const state = { error: '', message: '', loading: true, success: false };
      const actual = reducer(state, actions.loadingSuccess());

      expect(actual).toEqual({
        loading: false,
        error: '',
        message: '',
        success: true,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice<Actions, State>({ name });
      const state = { error: '', message: '', loading: true, success: false };
      const actual = reducer(state, actions.loadingSuccess('wow'));

      expect(actual).toEqual({
        loading: false,
        error: '',
        message: 'wow',
        success: true,
      });
    });
  });

  describe('error', () => {
    const name = 'loading';
    const { reducer, actions } = loadingSlice<Actions, State>({ name });
    const state = { error: '', message: 'cool', loading: true, success: false };
    const actual = reducer(state, actions.loadingError('some error'));

    expect(actual).toEqual({
      loading: false,
      message: '',
      error: 'some error',
      success: false,
    });
  });
});
