import deepFreeze from 'deep-freeze-strict';
import createListTable from './create-list-table';

describe('createListTable', () => {
  it('should merge lists', () => {
    const slice = createListTable({ name: 'test' });
    const state = deepFreeze({ 1: ['1', '2'] });
    const actual = slice.reducer(
      state,
      slice.actions.addItems({ '1': ['4'], '2': ['55'] }),
    );
    expect(actual).toEqual({ 1: ['1', '2', '4'], 2: ['55'] });
  });
});
