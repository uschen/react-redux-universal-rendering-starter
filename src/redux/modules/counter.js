import _debug from 'debug';
import { createAction, handleActions } from 'redux-actions';

const debug = _debug('app:redux:modules:counter');

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
export const COUNTER_SET = 'COUNTER_SET';
export const COUNTER_DECREMENT = 'COUNTER_DECREMENT';

// ------------------------------------
// Actions
// ------------------------------------
export const increment = createAction(COUNTER_INCREMENT, (value = 1) => value);
export const set = createAction(COUNTER_SET, (value) => value);
export const decrement = createAction(COUNTER_DECREMENT, (value = 0) => value);

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
// NOTE: This is solely for demonstration purposes. In a real application,
// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
// reducer take care of this logic.
export const doubleAsync = () => {
  return (dispatch, getState) => {
    debug('doubleAsync');
    setTimeout(() => {
      dispatch(increment(getState().counter));
    }, 1000);
  };
};

export const actions = {
  increment,
  doubleAsync
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [COUNTER_INCREMENT]: (state, {payload}) => state + payload,
  [COUNTER_DECREMENT]: (state, {payload}) => state - payload,
  [COUNTER_SET]: (state, {payload}) => payload,
}, 1);
