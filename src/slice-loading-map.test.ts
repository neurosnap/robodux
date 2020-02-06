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

describe('loaderMapSlice', () => {
  it('handles loading without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(reducer({}, actions.loading({ id: 'default' }))).toEqual({
      default: {
        loading: true,
        success: false,
        error: '',
        message: '',
      },
    });
  });

  it('handles success without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(reducer({}, actions.success({ id: 'default' }))).toEqual({
      default: {
        loading: false,
        success: true,
        error: '',
        message: '',
      },
    });
  });

  it('handles error without a channel', () => {
    const { reducer, actions } = buildLoader();

    expect(
      reducer(
        {},
        actions.error({ id: 'default', error: 'foo', message: 'foobar' }),
      ),
    ).toEqual({
      default: {
        loading: false,
        success: false,
        error: 'foo',
        message: 'foobar',
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
            error: 'an error that will be cleared',
            message: 'a message that will be cleared',
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
            error: 'an error that will be cleared',
            message: 'a message that will be cleared',
          },
        },
        actions.resetAll(),
      ),
    ).toEqual({});
  });
});
