import _debug from 'debug';
import { createAction, handleActions } from 'redux-actions';
import fetchr from './../utils/fetchr';
import uuid from 'node-uuid';

const debug = _debug('app:redux:modules:todos');

const initialState = {
  items: [],
  isLoaded: false
};
// ------------------------------------
// Constants
// ------------------------------------
export const TODO_ADD = 'ADD_TODO';
export const TODO_LIST = 'TODO_LIST';
// export const TODO_DELETE = 'TODO_DELETE';
// export const TODO_EDIT = 'TODO_EDIT';
// export const TODO_COMPLETE = 'TODO_COMPLETE';
// export const TODO_COMPLETE_ALL = 'TODO_COMPLETE_ALL';
// export const TODO_CLEAR_COMPLETED = 'TODO_CLEAR_COMPLETED';

// ------------------------------------
// Actions
// ------------------------------------
export const add = createAction(TODO_ADD, (todo) => todo, (todo) => {
  return {
    fetchr: {
      service: 'todos',
      method: 'create',
      body: todo
    }
  };
});
export const list = createAction(TODO_LIST, (value) => value, () => {
  return {
    fetchr: {
      service: 'todos',
      method: 'read'
    }
  };
});
// export const remove = createAction(TODO_DELETE);
// export const edit = createAction(TODO_EDIT);
// export const complete = createAction(TODO_COMPLETE);
// export const completeAll = createAction(TODO_COMPLETE_ALL);
// export const clearCompleted = createAction(TODO_CLEAR_COMPLETED);

export const actions = {
  add,
  list
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TODO_LIST]: (state, {payload}) => {
    debug('TODO_LIST', state, 'payload', payload);
    state.isLoaded = true;
    state.items = payload;
    debug('TODO_LIST', 'new state', state);
    return state;
  },
  [TODO_ADD]: (state, {payload}) => {
    state.items.push(payload);
  }
}, initialState);
