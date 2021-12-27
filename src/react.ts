import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { LoadingState } from './create-loader-table';
import type { QueryState } from './create-api';
import { selectLoaderById, selectDataById } from './create-api';

type Data<D = any> = LoadingState & { data: D | null; trigger: () => any };
type DataPayload<D = any, P = any> = LoadingState & {
  data: D | null;
  trigger: (p: P) => any;
};

export function useQuery<D = any, S = any, P = any>(
  actionFn: (p: P) => { type: string },
  selector: (s: S) => D,
): DataPayload<D>;
export function useQuery<D = any, S = any>(
  actionFn: () => { type: string },
  selector: (s: S) => D,
): Data<D>;
export function useQuery<D = any, S = any, P = any>(
  actionFn: (p?: P) => { type: string },
  selector: (s: S) => D,
): DataPayload<D> {
  const dispatch = useDispatch();
  const data = useSelector(selector);
  const loader = useSelector((s: QueryState) =>
    selectLoaderById(s, { id: `${actionFn}` }),
  );
  const trigger = (p?: P) => {
    dispatch(actionFn(p));
  };

  return { ...loader, trigger, data: data || null };
}

export function useSimpleCache<D = any, S = any>(action: {
  payload: { name: string; key: string };
}): Data<D> {
  const dispatch = useDispatch();
  const data = useSelector((s: S) =>
    selectDataById(s, { id: action.payload.key }),
  );
  const { name } = action.payload;
  const loader = useSelector((s: QueryState) =>
    selectLoaderById(s, { id: name }),
  );
  const trigger = () => {
    dispatch(action);
  };

  return { ...loader, trigger, data: data || null };
}

export function useLoaderSuccess(cur: LoadingState, success: () => any) {
  const [prev, setPrev] = useState(cur);
  useEffect(() => {
    const curSuccess = !cur.isLoading && cur.isSuccess;
    if (prev.isLoading && curSuccess) success();
    setPrev(cur);
  }, [cur.isSuccess, cur.isLoading]);
}
