import loaderMapSlice from './slice-loading-map';
import { defaultLoadingItem, LoadingItemState } from './slice-loading';

interface State {
  [key: string]: LoadingItemState;
}
const buildLoader = (overrides: Partial<State> = {}) =>
  loaderMapSlice({
    name: 'foo',
    ...overrides,
  });

const actualDate = Date.now;

describe('loaderMapSlice', () => {
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
        loading: true,
        success: false,
        error: false,
        message: '',
        timestamp: 123,
      },
    });
  });

  it('handles success without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(reducer({}, actions.success({ id: 'default' }))).toEqual({
      default: {
        loading: false,
        success: true,
        error: false,
        message: '',
        timestamp: 123,
      },
    });
  });

  it('handles error without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer({}, actions.error({ id: 'default', message: 'foobar' })),
    ).toEqual({
      default: {
        loading: false,
        success: false,
        error: true,
        message: 'foobar',
        timestamp: 123,
      },
    });
  });

  it('handles resetById without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer(
        {
          default: {
            loading: true,
            success: true,
            error: true,
            message: 'a message that will be cleared',
            timestamp: 0,
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
            loading: true,
            success: true,
            error: true,
            message: 'a message that will be cleared',
            timestamp: 0,
          },
        },
        actions.resetAll(),
      ),
    ).toEqual({});
  });
});
