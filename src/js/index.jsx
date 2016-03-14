import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/global/App';
import store from './modules/store';

if (process.env.NODE_ENV === 'debug'){
  const tools = require('redux-devtools/lib/react');
  const {DevTools, DebugPanel, LogMonitor} = tools;
  render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
      </DebugPanel>
    </div>
  ), document.getElementById('main'));
} else {
  render(
  (
    <div>
      <Provider store={store}>
        <App/>
      </Provider>
    </div>
  ), document.getElementById('main'));
}