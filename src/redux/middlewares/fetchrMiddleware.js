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
      if (meta.fetchr.loaded) {
        debug('meta.fetchr.loaded', type, payload);
        return next(action);
      }

      let fetchr = meta.fetchr;
      const {service, method, params, body, config} = fetchr;
      debug('meta.fetchr', fetchr);
      let fetchrService = fetchrInstance[method](service);
      let promise = fetchrService
        .params(params || {})
        .body(body || {})
        .clientConfig(config || {})
        .end()
        .then(function(res) {
          debug('fetchr', 'res', res);
          return res.data.data;
        });
      debug('send to next');
      next({...action, payload: promise, meta: Object.assign({}, meta, {fetchr: Object.assign({}, meta.fetchr, {loaded: true})})});
      return promise;
      // return

      //   .then(function (res) {
      //     debug('res', res);
      //     action.meta.fetchr.loaded = true;
      //     let newDispatch = {...action, payload: res.data};
      //     debug('fetchr', 'res', 'newDispatch', newDispatch);
      //     dispatch(newDispatch);
      //   })
      //   .catch(function (err) {
      //     debug('err', err);
      //     return dispatch({...action, payload: err, error: true});
      //   });
    };
  };
}
