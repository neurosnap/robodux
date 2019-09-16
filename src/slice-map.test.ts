import mapSlice from './slice-map';
import { PatchEntity } from './types';

interface State {
  [key: string]: string;
}

interface Actions {
  addTest: State;
  setTest: State;
  removeTest: string[];
  resetTest: never;
  patchTest: PatchEntity<State>;
}

describe('mapSlice', () => {
  describe('add', () => {
    it('should add items to map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State, Actions>({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = { 3: 'three' };
      const actual = reducer(state, actions.addTest(test));
      expect(actual).toEqual({ ...state, ...test });
    });
  });

  describe('set', () => {
    it('should set items to map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State, Actions, any>({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = { 3: 'three' };
      const actual = reducer(state, actions.setTest(test));
      expect(actual).toEqual(test);
    });
  });

  describe('remove', () => {
    it('should remove items from map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State, Actions, any>({ name });
      const state = { 1: 'one', 2: 'two', 3: 'three' };
      const actual = reducer(state, actions.removeTest(['1', '2']));
      expect(actual).toEqual({ 3: 'three' });
    });
  });

  describe('reset', () => {
    it('should reset map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State, Actions, any>({ name });
      const state = { 1: 'one', 2: 'two', 3: 'three' };
      const actual = reducer(state, actions.resetTest());
      expect(actual).toEqual({});
    });
  });

  describe('patch', () => {
    describe('when entity is an object', () => {
      it('should update a prop', () => {
        interface State {
          [key: string]: { name: string };
        }

        interface PatchActions {
          patchTest: PatchEntity<State>;
        }

        const name = 'test';
        const { reducer, actions } = mapSlice<State, PatchActions, any>({
          name,
        });
        const state = {
          1: { name: 'one' },
          2: { name: 'two' },
          3: { name: 'three' },
        };
        const actual = reducer(
          state,
          actions.patchTest({ 2: { name: 'four' } }),
        );
        expect(actual).toEqual({
          1: { name: 'one' },
          2: { name: 'four' },
          3: { name: 'three' },
        });
      });
    });
  });

  describe('when entity is *not* an object', () => {
    it('should update a prop', () => {
      interface State {
        [key: string]: string;
      }

      interface PatchActions {
        patchTest: PatchEntity<State>;
      }

      const name = 'test';
      const { reducer, actions } = mapSlice<State, PatchActions, any>({
        name,
      });
      const state = {
        1: 'one',
        2: 'two',
        3: 'three',
      };
      const actual = reducer(state, actions.patchTest({ 2: 'cool' }));
      expect(actual).toEqual({ '1': 'one', '2': 'two', '3': 'three' });
    });
  });
});
