import createTable, { mustSelectEntity, tableSelectors } from './create-table';
import deepFreeze from 'deep-freeze-strict';

interface Obj {
  id: string;
  text: string;
}

const defaultObj = (o: Partial<Obj> = {}): Obj => ({
  id: '',
  text: '',
  ...o,
});

const ex1 = defaultObj({ id: '1', text: 'hi' });
const ex2 = defaultObj({ id: '2', text: 'mom' });
const ex3 = defaultObj({ id: '3', text: 'wow' });

describe('createTable', () => {
  describe('add', () => {
    it('should add items to map', () => {
      const name = 'test';
      const { reducer, actions } = createTable<Obj>({ name });
      const test = {
        1: ex1,
        2: ex2,
      };
      const state = deepFreeze({ 3: ex3 });
      const actual = reducer(state, actions.add(test));
      expect(actual).toEqual({ ...state, ...test });
    });
  });

  describe('set', () => {
    it('should set items to map', () => {
      const name = 'test';
      const { reducer, actions } = createTable({ name });
      const test = {
        1: ex1,
        2: ex2,
      };
      const state = deepFreeze({ 3: ex3 });
      const actual = reducer(state, actions.set(test));
      expect(actual).toEqual(test);
    });
  });

  describe('remove', () => {
    it('should remove items from map', () => {
      const name = 'test';
      const { reducer, actions } = createTable({ name });
      const state = deepFreeze({ 1: ex1, 2: ex2, 3: ex3 });
      const actual = reducer(state, actions.remove(['1', '2']));
      expect(actual).toEqual({ 3: ex3 });
    });
  });

  describe('reset', () => {
    it('should reset map', () => {
      const name = 'test';
      const { reducer, actions } = createTable({ name });
      const state = deepFreeze({ 1: ex1, 2: ex2, 3: ex3 });
      const actual = reducer(state, actions.reset());
      expect(actual).toEqual({});
    });
  });

  describe('patch', () => {
    it('should update a prop', () => {
      interface Entity {
        name: string;
        email?: string;
      }

      const name = 'test';
      const { reducer, actions } = createTable<Entity>({
        name,
      });
      const state = deepFreeze({
        1: { name: 'one', email: 'one@wild.com' },
        2: { name: 'two' },
        3: { name: 'three', email: 'three@wild.com' },
      });
      const actual = reducer(
        state,
        actions.patch({ 2: { email: 'two@wild.com' } }),
      );
      expect(actual).toEqual({
        1: { name: 'one', email: 'one@wild.com' },
        2: { name: 'two', email: 'two@wild.com' },
        3: { name: 'three', email: 'three@wild.com' },
      });
    });
  });

  describe('merge', () => {
    it('should merge arrays', () => {
      interface Entity {
        name: string;
        ids?: string[];
      }
      const name = 'test';
      const { reducer, actions } = createTable<Entity>({
        name,
      });
      const state = deepFreeze({
        1: { name: 'one', ids: ['1', '2'] },
        2: { name: 'two' },
        3: { name: 'three', ids: ['b'] },
      });
      const actual = reducer(
        state,
        actions.merge({ 1: { ids: ['3', '4'] }, 2: { ids: ['a'] } }),
      );
      expect(actual).toEqual({
        1: { name: 'one', ids: ['1', '2', '3', '4'] },
        2: { name: 'two', ids: ['a'] },
        3: { name: 'three', ids: ['b'] },
      });
    });

    it('should merge objects 1-level deep', () => {
      interface Entity {
        name: string;
        social?: { twitter?: string; instagram?: string };
      }
      const name = 'test';
      const { reducer, actions } = createTable<Entity>({
        name,
      });
      const state = deepFreeze({
        1: { name: 'one', social: { twitter: 'abc' } },
        2: { name: 'two' },
        3: { name: 'three' },
      });
      const actual = reducer(
        state,
        actions.merge({
          1: { social: { instagram: 'bbb' } },
          2: { social: { twitter: 'xxx' } },
        }),
      );
      expect(actual).toEqual({
        1: { name: 'one', social: { twitter: 'abc', instagram: 'bbb' } },
        2: { name: 'two', social: { twitter: 'xxx' } },
        3: { name: 'three' },
      });
    });
  });

  describe('when entity is *not* an object', () => {
    it('should update a prop', () => {
      const name = 'test';
      const { reducer, actions } = createTable<Obj>({
        name,
      });
      const state = deepFreeze({
        1: ex1,
        2: ex2,
        3: ex3,
      });
      const actual = reducer(state, actions.patch({ 2: { text: 'cool' } }));
      expect(actual).toEqual({
        '1': ex1,
        '2': { id: '2', text: 'cool' },
        '3': ex3,
      });
    });
  });
});

describe('createTableSelectors', () => {
  describe('selectTableAsList selector', () => {
    it('should return the table data as a list', () => {
      const state = {
        1: ex1,
        2: ex2,
      };
      const selectors = tableSelectors<Obj>(() => state);
      expect(selectors.selectTableAsList(state)).toEqual(Object.values(state));
    });
  });

  describe('selectById selector', () => {
    it('should return a single record in the table', () => {
      const state = {
        1: ex1,
        2: ex2,
      };
      const selectors = tableSelectors<Obj>(() => state);
      expect(selectors.selectById(state, { id: '1' })).toEqual(state['1']);
    });

    describe('when no record is found', () => {
      it('should return undefined', () => {
        const state = {
          1: ex1,
          2: ex2,
        };
        const selectors = tableSelectors<Obj>(() => state);
        expect(selectors.selectById(state, { id: '3' })).toEqual(undefined);
      });
    });
  });

  describe('mustSelectById selector', () => {
    it('should return a single record in the table', () => {
      const state = {
        1: ex1,
        2: ex2,
      };
      const selectors = tableSelectors<Obj>(() => state);
      const selectById = mustSelectEntity(defaultObj())(selectors.selectById);
      expect(selectById(state, { id: '1' })).toEqual(state['1']);
    });

    describe('when no record is found', () => {
      const state = {
        1: ex1,
        2: ex2,
      };
      const selectors = tableSelectors<Obj>(() => state);
      const selectById = mustSelectEntity(defaultObj())(selectors.selectById);
      expect(selectById(state, { id: '3' })).toEqual(defaultObj());
    });
  });

  describe('selectByIds selector', () => {
    it('should return all ids that match the params', () => {
      const state = {
        1: ex1,
        2: ex2,
        3: ex3,
      };
      const selectors = tableSelectors<Obj>(() => state);
      expect(selectors.selectByIds(state, { ids: ['1', '3', '5'] })).toEqual([
        state['1'],
        state['3'],
      ]);
    });

    describe('when no records were found', () => {
      it('should return an empty array', () => {
        const state = {
          1: ex1,
        };
        const selectors = tableSelectors<Obj>(() => state);
        expect(selectors.selectByIds(state, { ids: ['3', '5'] })).toEqual([]);
      });
    });
  });

  describe('mustSelectById', () => {
    describe('when no record is found by id', () => {
      it('should return the default entity', () => {
        const state = {
          1: ex1,
        };
        const selectors = tableSelectors<Obj>(() => state);
        const selectById = mustSelectEntity(defaultObj)(selectors.selectById);
        expect(selectById(state, { id: '2' })).toEqual(defaultObj());
      });

      it('should return the same variable in memory', () => {
        const state = {
          1: ex1,
        };
        const selectors = tableSelectors<Obj>(() => state);
        const obj = defaultObj();
        const selectById = mustSelectEntity(obj)(selectors.selectById);
        const actual = selectById(state, { id: '2' });
        expect(actual == obj).toBe(true);
      });
    });
  });
});
