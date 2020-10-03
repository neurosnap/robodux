import { createSelector } from 'reselect';
import { mapReducers } from './create-map';
import createSlice from './create-slice';
import {
  AnyState,
  excludesFalse,
  MapEntity,
  PatchEntity,
  SliceHelper,
  PropId,
  PropIds,
} from './types';

export interface TableSelectors<Entity extends AnyState = AnyState, S = any> {
  findById: (d: MapEntity<Entity>, { id }: PropId) => Entity | undefined;
  findByIds: (d: MapEntity<Entity>, { ids }: PropIds) => Entity[];
  tableAsList: (d: MapEntity<Entity>) => Entity[];
  selectTable: (s: S) => MapEntity<Entity>;
  selectTableAsList: (state: S) => Entity[];
  selectById: (s: S, p: PropId) => Entity | undefined;
  selectByIds: (s: S, p: { ids: string[] }) => Entity[];
}

export function tableSelectors<Entity extends AnyState = AnyState, S = any>(
  selectTable: (s: S) => MapEntity<Entity>,
): TableSelectors<Entity, S> {
  const tableAsList = (data: MapEntity<Entity>): Entity[] =>
    Object.values(data).filter(excludesFalse);
  const findById = (data: MapEntity<Entity>, { id }: PropId) => data[id];
  const findByIds = (data: MapEntity<Entity>, { ids }: PropIds): Entity[] =>
    ids.map((id) => data[id]).filter(excludesFalse);
  const selectById = (state: S, { id }: PropId): Entity | undefined => {
    const data = selectTable(state);
    return findById(data, { id });
  };
  return {
    findById,
    findByIds,
    tableAsList,
    selectTable,
    selectTableAsList: createSelector(
      selectTable,
      (data): Entity[] => tableAsList(data),
    ),
    selectById,
    selectByIds: createSelector(
      selectTable,
      (s: S, p: PropIds) => p,
      findByIds,
    ),
  };
}

export function mustSelectEntity<Entity extends AnyState = AnyState, S = any>(
  defaultEntity: Entity | (() => Entity),
) {
  const isFn = typeof defaultEntity === 'function';
  return (selectById: (s: S, p: PropId) => Entity | undefined) => (
    state: S,
    { id }: PropId,
  ): Entity => {
    if (isFn) {
      const entity = defaultEntity as () => Entity;
      return selectById(state, { id }) || entity();
    }

    return selectById(state, { id }) || (defaultEntity as Entity);
  };
}

interface TableReducers<Entity extends AnyState = AnyState> {
  add: (
    state: MapEntity<Entity>,
    payload: MapEntity<Entity>,
  ) => MapEntity<Entity>;
  set: (
    state: MapEntity<Entity>,
    payload: MapEntity<Entity>,
  ) => MapEntity<Entity>;
  remove: (state: MapEntity<Entity>, payload: string[]) => MapEntity<Entity>;
  reset: (state: MapEntity<Entity>) => MapEntity<Entity>;
  merge: (
    state: MapEntity<Entity>,
    payload: PatchEntity<MapEntity<Entity>>,
  ) => MapEntity<Entity>;
  patch: (
    state: MapEntity<Entity>,
    payload: PatchEntity<MapEntity<Entity>>,
  ) => MapEntity<Entity>;
}

export function tableReducers<Entity extends AnyState = AnyState>(
  initialState = {} as MapEntity<Entity>,
): TableReducers<Entity> {
  return mapReducers(initialState);
}

export function createTableAdapter<Entity extends AnyState = AnyState>(
  initialState = {} as MapEntity<Entity>,
) {
  const reducers = tableReducers(initialState);
  return {
    reducers,
    getSelectors: <S>(stateFn: (s: S) => MapEntity<Entity>) =>
      tableSelectors(stateFn),
  };
}

interface TableActions<S> {
  add: MapEntity<S>;
  set: MapEntity<S>;
  remove: string[];
  patch: PatchEntity<MapEntity<S>>;
  merge: PatchEntity<MapEntity<S>>;
  reset: never;
}

export default function createTable<Entity extends AnyState = AnyState>({
  name,
  extraReducers,
  initialState = {} as MapEntity<Entity>,
}: SliceHelper<MapEntity<Entity>>) {
  const { reducers, ...adapter } = createTableAdapter<Entity>(initialState);
  const slice = createSlice<MapEntity<Entity>, TableActions<Entity>>({
    name,
    initialState,
    extraReducers,
    reducers,
    useImmer: false,
  });

  return { ...slice, ...adapter };
}
