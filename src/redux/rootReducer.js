import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import counter from './modules/counter';

export default combineReducers({
  router,
  reduxAsyncConnect,
  counter
});
