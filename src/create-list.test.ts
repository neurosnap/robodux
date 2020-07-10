import deepFreeze from 'deep-freeze-strict';
import createList from './create-list';

describe('createList', () => {
  describe('add', () => {
    it('should add items to list', () => {
      const name = 'test';
      const { reducer, actions } = createList<string[]>({ name });
      const vals = ['three'];
      const state = deepFreeze(vals);
      const actual = reducer(state, actions.add(vals));
      expect(actual).toEqual([...state, ...vals]);
    });
  });

  describe('remove', () => {
    it('should remove items to list', () => {
      const name = 'test';
      const { reducer, actions } = createList<string[]>({ name });
      const vals = [0];
      const state = deepFreeze(['one', 'two']);
      const actual = reducer(state, actions.remove(vals));
      expect(actual).toEqual(['two']);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const name = 'test';
      const { reducer, actions } = createList<string[]>({
        name,
        initialState: ['three'],
      });
      const state = deepFreeze(['one', 'two']);
      const actual = reducer(state, actions.reset());
      expect(actual).toEqual(['three']);
    });
  });
});
