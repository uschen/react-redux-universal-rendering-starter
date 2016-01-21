import _debug from 'debug';
import config from '../../config';
import getTools from './tools';
import React from 'react';
import { renderToString } from 'react-dom/server';
import getStatusFromRoutes from './../helpers/getStatusFromRoutes';
import Html from './../helpers/Html';
import configureStore from '../redux/configureStore';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import routes from './../routes';
const pretty = new PrettyError();
const tools = getTools();
const debug = _debug('app:server:render');

export default function handleRender(req, res) {
  if (config.env === 'development') {
    tools.refresh();
  }
  const history = createMemoryHistory();
  const store = configureStore(
    history
  );
  debug('location', req.originalUrl);
  match({
    history,
    routes,
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
    debug('renderProps', renderProps);
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
    } else if (renderProps) {
      const component = (
      <Provider store={store} key='provider'>
            <RouterContext {...renderProps} />
          </Provider>
      );
      const status = getStatusFromRoutes(renderProps.routes);
      if (status) {
        res.status(status);
      }
      res.send('<!doctype html>\n' +
        renderToString(<Html assets={tools.assets()} component={component} store={store}/>));

    } else {
      res.status(404).send('Not found');
    }
  });
}
