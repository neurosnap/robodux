import createSlice from './slice';

describe('createSlice', () => {
  describe('when passing slice', () => {
    const { actions, reducer } = createSlice({
      reducts: {
        increment: (state) => state + 1,
        multiply: (state, payload: number) => state * payload,
      },
      initialState: 0,
      name: 'cool',
    });

    it('should create increment action', () => {
      expect(actions.hasOwnProperty('increment')).toBe(true);
    });
    it('should create multiply action', () => {
      expect(actions.hasOwnProperty('multiply')).toBe(true);
    });

    it('should have the correct action for increment', () => {
      expect(actions.increment()).toEqual({
        type: 'cool/increment',
        payload: undefined,
      });
    });
    it('should have the correct action for multiply', () => {
      expect(actions.multiply(5)).toEqual({
        type: 'cool/multiply',
        payload: 5,
      });
    });

    it('should return the correct value from reducer', () => {
      expect(reducer(undefined, actions.increment())).toEqual(1);
    });
    it('should return the correct value from reducer when multiplying', () => {
      expect(reducer(5, actions.multiply(5))).toEqual(25);
    });
  });

  describe('when mutating state object', () => {
    const { actions, reducer } = createSlice({
      reducts: {
        setUserName: (state, payload: string) => {
          state.user = payload;
        },
      },
      initialState: { user: '' },
      name: 'user',
    });

    it('should set the username', () => {
      expect(reducer({ user: 'hi' }, actions.setUserName('eric'))).toEqual({
        user: 'eric',
      });
    });
  });

  describe('when adding extra actions', () => {
    it('should create action reducer pair without action type namespacing', () => {
      const { actions, reducer } = createSlice({
        reducts: {
          setUserName: (state, payload: string) => {
            state.user = payload;
          },
        },
        extraReducers: {
          another: (state, payload) => {
            state.another = payload;
          },
        },
        initialState: { user: '', another: '' },
        name: 'user',
      });

      expect(
        reducer(
          { user: 'hi', another: '' },
          { type: 'another', payload: 'wow' },
        ),
      ).toEqual({
        another: 'wow',
        user: 'hi',
      });
    });
  });
});
