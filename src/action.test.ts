import createAction from './action';

describe('createAction', () => {
  it('should create an action', () => {
    const action = createAction<string>('A_TYPE');
    const actual = action('something');

    expect(actual).toEqual({
      type: 'A_TYPE',
      payload: 'something',
    });
  });

  it('should create an action without payload', () => {
    const action = createAction('A_TYPE');
    expect(action()).toEqual({
      type: 'A_TYPE',
    });
  });

  it('should create an action with payload', () => {
    const action = createAction<boolean>('A_TYPE');
    expect(action(false)).toEqual({
      type: 'A_TYPE',
      payload: false,
    });
  });

  describe('when stringifying action', () => {
    it('should return the action type', () => {
      const action = createAction('A_TYPE');
      expect(`${action}`).toEqual('A_TYPE');
    });
  });
});
