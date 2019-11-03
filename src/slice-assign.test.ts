import assignSlice from './slice-assign';

describe('assignSlice', () => {
  describe('set', () => {
    it('should set state to payload', () => {
      const name = 'test';
      const { reducer, actions } = assignSlice({ name, initialState: 0 });
      const actual = reducer(0, actions.set(2));
      expect(actual).toEqual(2);
    });
  });

  describe('reset', () => {
    it('should reset to initialState', () => {
      const name = 'test';
      const { reducer, actions } = assignSlice({ name, initialState: 5 });
      const actual = reducer(0, actions.reset());
      expect(actual).toEqual(5);
    });
  });
});
