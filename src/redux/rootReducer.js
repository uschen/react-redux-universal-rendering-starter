import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import counter from './modules/counter';
import todos from './modules/todos';

export default combineReducers({
  router,
  reduxAsyncConnect,
  counter,
  todos
});
