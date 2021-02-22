import createTable, { mustSelectEntity } from '../src/create-table';
import { MapEntity } from '../src/types';

// testing no params
const one = createTable({ name: 'SLICE' });
// $ExpectType { add: (payload: MapEntity<AnyState>) => Action<MapEntity<AnyState>, string>; set: (payload: MapEntity<AnyState>) => Action<...>; remove: (payload: string[]) => Action<...>; patch: (payload: PatchEntity<...>) => Action<...>; merge: (payload: PatchEntity<...>) => Action<...>; reset: () => Action<...>; }
one.actions;
// $ExpectType Reducer<MapEntity<AnyState>, Action<any, string>>
one.reducer;
// $ExpectType string
one.name;

// testing with params
interface Obj {
  id: string;
  text: string;
}

interface State {
  obj: MapEntity<Obj>;
}

const state = {
  obj: {},
};

const two = createTable<Obj>({ name: 'slice' });
// $ExpectType (payload: MapEntity<Obj>) => Action<MapEntity<Obj>, string>
two.actions.add;
// $ExpectType (payload: MapEntity<Obj>) => Action<MapEntity<Obj>, string>
two.actions.set;
// $ExpectType (payload: string[]) => Action<string[], string>
two.actions.remove;
// $ExpectType () => Action<any, string>
two.actions.reset;
// $ExpectType (payload: PatchEntity<MapEntity<Obj>>) => Action<PatchEntity<MapEntity<Obj>>, string>
two.actions.merge;
// $ExpectType (payload: PatchEntity<MapEntity<Obj>>) => Action<PatchEntity<MapEntity<Obj>>, string>
two.actions.patch;
// $ExpectType Reducer<MapEntity<Obj>, Action<any, string>>
two.reducer;
// $ExpectType string
two.name;
const {
  selectById,
  selectByIds,
  selectTableAsList,
  selectTable,
} = two.getSelectors((s: State) => s.obj);
// $ExpectType Obj | undefined
selectById(state, { id: '1' });
// $ExpectType Obj[]
selectByIds(state, { ids: ['1'] });
// $ExpectType Obj[]
selectTableAsList(state);
// $ExpectType MapEntity<Obj>
selectTable(state);

const defaultObj = (): Obj => {
  return {
    id: '',
    text: '',
  };
};

const three = createTable<Obj>({ name: 'obj' });
const selectors = three.getSelectors((s: State) => s.obj);
const createEntitySelector = mustSelectEntity(defaultObj);
const selectObjById = createEntitySelector(selectors.selectById);
// $ExpectType Obj
selectObjById(state, { id: '1' });
// $ExpectType any
const findObjById = createEntitySelector(selectors.findById);
// $ExpectType Obj
findObjById(state.obj, { id: '1' });
// $ExpectType any
const selectObj2ById = mustSelectEntity(defaultObj())(selectors.selectById);
// $ExpectType Obj
selectObj2ById(state, { id: '1' });
