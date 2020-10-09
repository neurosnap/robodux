import createMap from './create-map';
import deepFreeze from 'deep-freeze-strict';

interface State {
  [key: string]: string;
}

describe('createMap', () => {
  describe('add', () => {
    it('should add items to map', () => {
      const name = 'test';
      const { reducer, actions } = createMap<State>({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = deepFreeze({ 3: 'three' });
      const actual = reducer(state, actions.add(test));
      expect(actual).toEqual({ ...state, ...test });
    });
  });

  describe('set', () => {
    it('should set items to map', () => {
      const name = 'test';
      const { reducer, actions } = createMap({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = deepFreeze({ 3: 'three' });
      const actual = reducer(state, actions.set(test));
      expect(actual).toEqual(test);
    });
  });

  describe('remove', () => {
    it('should remove items from map', () => {
      const name = 'test';
      const { reducer, actions } = createMap({ name });
      const state = deepFreeze({ 1: 'one', 2: 'two', 3: 'three' });
      const actual = reducer(state, actions.remove(['1', '2']));
      expect(actual).toEqual({ 3: 'three' });
    });
  });

  describe('reset', () => {
    it('should reset map', () => {
      const name = 'test';
      const { reducer, actions } = createMap({ name });
      const state = deepFreeze({ 1: 'one', 2: 'two', 3: 'three' });
      const actual = reducer(state, actions.reset());
      expect(actual).toEqual({});
    });
  });

  describe('patch', () => {
    describe('when entity is an object', () => {
      it('should update a prop', () => {
        interface State {
          [key: string]: { name: string; email?: string };
        }

        const name = 'test';
        const { reducer, actions } = createMap<State>({
          name,
        });
        const state = deepFreeze({
          1: { name: 'one' },
          2: { name: 'two' },
          3: { name: 'three' },
        });
        const actual = reducer(
          state,
          actions.patch({ 2: { email: 'two@wild.com' } }),
        );
        expect(actual).toEqual({
          1: { name: 'one' },
          2: { name: 'two', email: 'two@wild.com' },
          3: { name: 'three' },
        });
      });
    });
  });

  describe('when entity is *not* an object', () => {
    it('should update a prop', () => {
      const name = 'test';
      const { reducer, actions } = createMap<State>({
        name,
      });
      const state = deepFreeze({
        1: 'one',
        2: 'two',
        3: 'three',
      });
      const actual = reducer(state, actions.patch({ 2: 'cool' }));
      expect(actual).toEqual({ '1': 'one', '2': 'two', '3': 'three' });
    });
  });
});
