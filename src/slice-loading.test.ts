import * as freeze from 'deep-freeze-strict';

import loadingSlice from './slice-loading';

describe('loadingSlice', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: false,
        success: false,
      });
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
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: false,
        success: false,
      });
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
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: true,
        success: false,
      });
      const actual = reducer(state, actions.success());

      expect(actual).toEqual({
        loading: false,
        error: '',
        message: '',
        success: true,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: true,
        success: false,
      });
      const actual = reducer(state, actions.success('wow'));

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
    const { reducer, actions } = loadingSlice({ name });
    const state = freeze({
      error: '',
      message: 'cool',
      loading: true,
      success: false,
    });
    const actual = reducer(state, actions.error('some error'));

    expect(actual).toEqual({
      loading: false,
      message: '',
      error: 'some error',
      success: false,
    });
  });
});
