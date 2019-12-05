import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class Navigation extends React.Component {

  componentDidMount() {
    console.log('%c=== Mounted: components/shared/Navigation ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <React.Fragment>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
        </ul>
      </React.Fragment>
    );
  }

}

export default Navigation;
