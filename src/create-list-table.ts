import { listReducers } from './create-list';
import { MapEntity, SliceHelper } from './types';
import { mapReducers } from './create-map';
import createSlice from './create-slice';

interface ListTableActions<M extends any[]> {
  add: MapEntity<M>;
  set: MapEntity<M>;
  remove: string[];
  reset: never;
  addItems: MapEntity<M>;
}

export default function createListTable<M extends any[] = string[]>({
  name,
  initialState = {},
  extraReducers,
}: SliceHelper<MapEntity<M>>) {
  const listReducer = listReducers<M>([] as any);
  const map = mapReducers(initialState);

  return createSlice<MapEntity<M>, ListTableActions<M>>({
    name,
    initialState,
    extraReducers,
    useImmer: false,
    reducers: {
      add: map.add,
      set: map.set,
      remove: map.remove,
      reset: map.reset,
      addItems: (state: MapEntity<M>, p: MapEntity<M>) => {
        const nextState = { ...state };
        Object.keys(p).forEach((key) => {
          if (nextState[key]) {
            nextState[key] = listReducer.add(
              nextState[key] as any,
              p[key] as any,
            );
          } else {
            nextState[key] = p[key];
          }
        });
        return nextState;
      },
    },
  });
}
