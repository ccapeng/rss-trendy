import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";

import App from './components/App';
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById('app')
);
