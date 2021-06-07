import freeze from 'deep-freeze-strict';

import createLoader from './create-loader';

describe('createLoader', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'idle' as 'idle',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });
      const actual = reducer(state, actions.loading({ timestamp: 1 }));

      expect(actual).toEqual({
        status: 'loading' as 'loading',
        message: '',
        lastRun: 1,
        meta: {},
        lastSuccess: 0,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'idle' as 'idle',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });
      const actual = reducer(
        state,
        actions.loading({ message: 'hi there', timestamp: 2 }),
      );

      expect(actual).toEqual({
        status: 'loading' as 'loading',
        message: 'hi there',
        lastRun: 2,
        meta: {},
        lastSuccess: 0,
      });
    });

    it('should set the state to loading with timestamp', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'idle' as 'idle',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });

      const actualNow = Date.now;
      Date.now = () => 123;
      const actual = reducer(state, actions.loading());
      Date.now = actualNow;

      expect(actual).toEqual({
        status: 'loading' as 'loading',
        message: '',
        lastSuccess: 0,
        meta: {},
        lastRun: 123,
      });
    });
  });

  describe('success', () => {
    it('should set the state to success', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'loading' as 'loading',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });
      const actual = reducer(state, actions.success({ timestamp: 5 }));

      expect(actual).toEqual({
        status: 'success' as 'success',
        message: '',
        lastSuccess: 5,
        meta: {},
        lastRun: 0,
      });
    });

    it('should set the meta object', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'loading' as 'loading',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });
      const actual = reducer(
        state,
        actions.success({ timestamp: 5, meta: { something: 'great' } }),
      );

      expect(actual).toEqual({
        status: 'success' as 'success',
        message: '',
        lastSuccess: 5,
        meta: { something: 'great' },
        lastRun: 0,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'idle' as 'idle',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });
      const actual = reducer(
        state,
        actions.success({ message: 'wow', timestamp: 2 }),
      );

      expect(actual).toEqual({
        status: 'success' as 'success',
        message: 'wow',
        meta: {},
        lastSuccess: 2,
        lastRun: 0,
      });
    });

    it('should set the state to success with timestamp', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader({ name });
      const state = freeze({
        status: 'idle' as 'idle',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      });

      const actualNow = Date.now;
      Date.now = () => 123;
      const actual = reducer(state, actions.success());
      Date.now = actualNow;

      expect(actual).toEqual({
        status: 'success' as 'success',
        message: '',
        meta: {},
        lastSuccess: 123,
        lastRun: 0,
      });
    });
  });

  describe('error', () => {
    const name = 'loading';
    const { reducer, actions } = createLoader({ name });
    const state = freeze({
      status: 'loading' as 'loading',
      message: 'cool',
      lastRun: 0,
      meta: {},
      lastSuccess: 0,
    });
    const actual = reducer(state, actions.error({ message: 'something' }));

    expect(actual).toEqual({
      status: 'error' as 'error',
      message: 'something',
      meta: {},
      lastRun: 0,
      lastSuccess: 0,
    });
  });

  describe('create loader with generic metadata', () => {
    it('should hold the correct metadata', () => {
      const name = 'loading';
      const { reducer, actions } = createLoader<{
        error: string;
        code: number;
      }>({ name });
      const state = freeze({
        status: 'loading' as 'loading',
        message: 'cool',
        lastRun: 0,
        meta: { error: '', code: 0 },
        lastSuccess: 0,
      });
      const actual = reducer(
        state,
        actions.error({
          message: 'something',
          meta: { error: 'bad', code: 400 },
        }),
      );
      expect(actual).toEqual({
        status: 'error' as 'error',
        message: 'something',
        meta: { error: 'bad', code: 400 },
        lastRun: 0,
        lastSuccess: 0,
      });
    });
  });
});
