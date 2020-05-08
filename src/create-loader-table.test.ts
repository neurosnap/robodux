import createLoaderTable from './create-loader-table';
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
        loading: true,
        success: false,
        error: false,
        message: '',
        lastRun: 123,
        lastSuccess: 0,
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
        lastRun: 0,
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
        loading: false,
        success: false,
        error: true,
        message: 'foobar',
        lastRun: 0,
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
            loading: true,
            success: true,
            error: true,
            message: 'a message that will be cleared',
            lastRun: 0,
            lastSuccess: 0,
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
            lastRun: 0,
            lastSuccess: 0,
          },
        },
        actions.resetAll(),
      ),
    ).toEqual({});
  });
});
