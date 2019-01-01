import mapSlice from './slice-map';

interface State {
  [key: string]: string;
}

interface Actions {
  addTest: State;
  setTest: State;
  removeTest: string[];
  resetTest: never;
}

describe('mapSlice', () => {
  describe('add', () => {
    it('should add items to map', () => {
      const slice = 'test';
      const { reducer, actions, selectors } = mapSlice<Actions, State>(slice);
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
      const slice = 'test';
      const { reducer, actions } = mapSlice<Actions, State, any>(slice);
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
      const slice = 'test';
      const { reducer, actions } = mapSlice<Actions, State, any>(slice);
      const state = { 1: 'one', 2: 'two', 3: 'three' };
      const actual = reducer(state, actions.removeTest(['1', '2']));
      expect(actual).toEqual({ 3: 'three' });
    });
  });

  describe('reset', () => {
    it('should reset map', () => {
      const slice = 'test';
      const { reducer, actions } = mapSlice<Actions, State, any>(slice);
      const state = { 1: 'one', 2: 'two', 3: 'three' };
      const actual = reducer(state, actions.resetTest());
      expect(actual).toEqual({});
    });
  });
});
