import _debug from 'debug';
import config from '../config';
import getTools from './tools';
import React from 'react';
import { renderToString } from 'react-dom/server';
// import { Provider } from 'react-redux';
import getStatusFromRoutes from './../src/helpers/getStatusFromRoutes';
import Html from './../src/helpers/Html';
// import Root from './../src/containers/Root';
import configureStore from '../src/redux/configureStore';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import routes from './../src/routes';
const pretty = new PrettyError();
const tools = getTools();

export default function handleRender(req, res) {
  if (config.env === 'development') {
    tools.refresh();
  }
  // var webpaimport getTools from './tools';ckStats = require('./webpack_stats.json');
  // const historyConfig = {
  //   basename: ''
  // };
  // debug('handleRender', useRouterHistory);
  const middlewares = [];
  const history = createMemoryHistory();
  const store = configureStore(
    history
  );

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      renderToString(<Html assets={tools.assets()} store={store}/>));
  }

  match({
    history,
    routes,
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
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

  // store.dispatch(match({
  //   history,
  //   routes,
  //   location: req.originalUrl
  // }, (error, redirectLocation, renderProps) => {
  //   if (redirectLocation) {
  //     res.redirect(redirectLocation.pathname + redirectLocation.search);
  //   } else if (error) {
  //     console.error('ROUTER ERROR:', pretty.render(error));
  //     res.status(500);
  //     hydrateOnClient();
  //   } else if (!renderProps) {
  //     res.status(500);
  //     hydrateOnClient();
  //   } else {
  //     store.getState().router.then(() => {
  //       const component = (
  //       <Provider store={store} key='provider'>
  //           <RoutingContext {...renderProps} />
  //         </Provider>
  //       );

  //       const status = getStatusFromRoutes(renderProps.routes);
  //       if (status) {
  //         res.status(status);
  //       }
  //       res.send('<!doctype html>\n' +
  //         renderToString(<Html assets={tools.assets()} component={component} store={store}/>));
  //     }).catch((err) => {
  //       console.error('DATA FETCHING ERROR:', pretty.render(err));
  //       res.status(500);
  //       hydrateOnClient();
  //     });
  //   }
  // }));
}
