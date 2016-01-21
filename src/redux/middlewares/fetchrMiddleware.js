import _debug from 'debug';
const debug = _debug('app:redux:middlewares:fetchr');

export default function fetchrMiddleware(fetchrInstance) {
  debug('fetchrMiddleware');
  // signature of middleware:
  // store => next => action => ...
  return ({dispatch, getState}) => {
    return next => action => {
      let {type, payload, error, meta} = action;
      if (!meta || !meta.fetchr) {
        debug('no meta or meta.fetchr');
        return next(action);
      }
      let fetchr = meta.fetchr;
      const {service, method, params, body, config} = fetchr;
      debug('meta.fetchr', fetchr);
      fetchrInstance[method](service)
        .params(params || {})
        .body(body || {})
        .clientConfig(config || {})
        .end((err, res) => {
          if (err) {
            debug('err', err);
            return dispatch({...action, payload: err, error: true});
          }
          debug('res', res);
          dispatch({...action, payload: res.body});
        });
    };
  };
}
