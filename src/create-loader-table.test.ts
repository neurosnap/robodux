import createLoaderTable, { defaultLoader } from './create-loader-table';
import { defaultLoadingItem, LoadingItemState } from './create-loader';

interface State {
  [key: string]: LoadingItemState;
}
const buildLoader = (overrides: Partial<State> = {}) =>
  createLoaderTable({
    name: 'foo',
    ...overrides,
  });

const actualDate = Date.now;

describe('createLoaderTable', () => {
  beforeEach(() => {
    Date.now = () => 123;
  });

  afterEach(() => {
    Date.now = actualDate;
  });

  it('handles loading without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(reducer({}, actions.loading({ id: 'default' }))).toEqual({
      default: {
        status: 'loading',
        message: '',
        meta: {},
        lastRun: 123,
        lastSuccess: 0,
      },
    });
  });

  it('handles success without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(reducer({}, actions.success({ id: 'default' }))).toEqual({
      default: {
        status: 'success',
        message: '',
        lastRun: 0,
        meta: {},
        lastSuccess: 123,
      },
    });
  });

  it('handles error without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer({}, actions.error({ id: 'default', message: 'foobar' })),
    ).toEqual({
      default: {
        status: 'error',
        message: 'foobar',
        lastRun: 0,
        meta: {},
        lastSuccess: 0,
      },
    });
  });

  it('handles resetById without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer(
        {
          default: {
            status: 'error',
            message: 'a message that will be cleared',
            lastRun: 0,
            lastSuccess: 0,
            meta: {},
          },
        },
        actions.resetById('default'),
      ),
    ).toEqual({
      default: defaultLoadingItem(),
    });
  });

  it('handles resetAll without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer(
        {
          default: {
            status: 'loading',
            message: 'a message that will be cleared',
            lastRun: 0,
            lastSuccess: 0,
            meta: {},
          },
        },
        actions.resetAll(),
      ),
    ).toEqual({});
  });

  describe('getSelectors', () => {
    it('should select the entire table', () => {
      const { getSelectors } = buildLoader();
      const selectors = getSelectors((state: State) => state);
      const users = defaultLoadingItem({ status: 'success' });
      const token = defaultLoadingItem({ message: 'wow' });
      expect(
        selectors.selectTable({
          users,
          token,
        }),
      ).toEqual({ users, token });
    });

    it('should select a single loader', () => {
      const { getSelectors } = buildLoader();
      const selectors = getSelectors((state: State) => state);
      const users = defaultLoader(defaultLoadingItem({ status: 'success' }));
      const token = defaultLoader(defaultLoadingItem({ message: 'wow' }));
      const result = selectors.selectById(
        {
          users,
          token,
        },
        { id: 'users' },
      );
      expect(result).toEqual(users);
    });

    describe('when the loader is not found', () => {
      const { getSelectors } = buildLoader();
      const selectors = getSelectors((state: State) => state);
      const result = selectors.selectById(undefined as any, { id: 'users' });

      expect(result).toEqual(defaultLoader());
    });

    it('should select multiple loaders', () => {
      const { getSelectors } = buildLoader();
      const selectors = getSelectors((state: State) => state);
      const users = defaultLoader(defaultLoadingItem({ status: 'success' }));
      const token = defaultLoader(defaultLoadingItem({ message: 'wow' }));
      expect(
        selectors.selectByIds(
          {
            users,
            token,
          },
          { ids: ['users', 'token'] },
        ),
      ).toEqual([users, token]);
    });
  });
});
