import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './stores/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ScrollToTop from './layout/ScrollToTop';

export const history = createBrowserHistory();
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <React.StrictMode>
      <Router history={history}>
        <ScrollToTop />
        <App />
      </Router>
    </React.StrictMode>
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
