import createAssign from './create-assign';

describe('createAssign', () => {
  describe('set', () => {
    it('should set state to payload', () => {
      const name = 'test';
      const { reducer, actions } = createAssign({ name, initialState: 0 });
      const actual = reducer(0, actions.set(2));
      expect(actual).toEqual(2);
    });
  });

  describe('reset', () => {
    it('should reset to initialState', () => {
      const name = 'test';
      const { reducer, actions } = createAssign({ name, initialState: 5 });
      const actual = reducer(0, actions.reset());
      expect(actual).toEqual(5);
    });
  });
});
