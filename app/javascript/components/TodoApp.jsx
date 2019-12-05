import React from 'react';
import PropTypes from 'prop-types';

import Routes from './utils/Routes';

class TodoApp extends React.Component {

  componentDidMount() {
    console.log('%c=== Mounted: components/TodoApp ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <Routes />
    );

  }

}

export default TodoApp;