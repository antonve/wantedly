import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from '../reducers';


export default function configureStore(initialState) {
  const logger = createLogger()
  const finalCreateStore = compose(
    applyMiddleware(promise, logger, thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
