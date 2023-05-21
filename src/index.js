import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'jotai';
import TodoApp from './TodoApp';

ReactDOM.render(
  <Provider>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
