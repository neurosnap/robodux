import freeze from 'deep-freeze-strict';

import loadingSlice from './slice-loading';

describe('loadingSlice', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: false,
        message: '',
        loading: false,
        success: false,
        timestamp: 0,
      });
      const actual = reducer(state, actions.loading({ timestamp: 1 }));

      expect(actual).toEqual({
        loading: true,
        error: false,
        message: '',
        success: false,
        timestamp: 1,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: false,
        message: '',
        loading: false,
        success: false,
        timestamp: 0,
      });
      const actual = reducer(
        state,
        actions.loading({ message: 'hi there', timestamp: 2 }),
      );

      expect(actual).toEqual({
        loading: true,
        error: false,
        message: 'hi there',
        success: false,
        timestamp: 2,
      });
    });
  });

  describe('success', () => {
    it('should set the state to success', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: false,
        message: '',
        loading: true,
        success: false,
        timestamp: 0,
      });
      const actual = reducer(state, actions.success({ timestamp: 5 }));

      expect(actual).toEqual({
        loading: false,
        error: false,
        message: '',
        success: true,
        timestamp: 5,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: false,
        message: '',
        loading: true,
        success: false,
        timestamp: 0,
      });
      const actual = reducer(
        state,
        actions.success({ message: 'wow', timestamp: 2 }),
      );

      expect(actual).toEqual({
        loading: false,
        error: false,
        message: 'wow',
        success: true,
        timestamp: 2,
      });
    });

    it('should set the state to success with timestamp', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: false,
        message: '',
        loading: true,
        success: false,
        timestamp: 0,
      });

      const actualNow = Date.now;
      Date.now = () => 123;
      const actual = reducer(state, actions.success());
      Date.now = actualNow;

      expect(actual).toEqual({
        loading: false,
        error: false,
        message: '',
        success: true,
        timestamp: 123,
      });
    });
  });

  describe('error', () => {
    const name = 'loading';
    const { reducer, actions } = loadingSlice({ name });
    const state = freeze({
      error: false,
      message: 'cool',
      loading: true,
      success: false,
      timestamp: 0,
    });
    const actual = reducer(
      state,
      actions.error({ message: 'something', timestamp: 3 }),
    );

    expect(actual).toEqual({
      loading: false,
      message: 'something',
      error: true,
      success: false,
      timestamp: 3,
    });
  });
});
