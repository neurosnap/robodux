export { default as createAction, getActionType } from './action';
export { default as createReducer } from './reducer';
export { default as mapSlice } from './slice-map';
export { default as assignSlice } from './slice-assign';
export { default as loadingSlice } from './slice-loading';
export * from './slice-loading';
export * from './types';
import robodux from './slice';
export default robodux;
