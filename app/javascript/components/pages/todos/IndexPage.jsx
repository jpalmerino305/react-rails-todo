import React from 'react';
import PropTypes from 'prop-types';

class IndexPage extends React.Component {

  componentDidMount(){
    console.log('%c=== Mounted: components/pages/todos/IndexPage ===', 'color: green; font-weight: bold;');
  }

  render () {
    return (
      <React.Fragment>
        <h1>Todos Page</h1>
      </React.Fragment>
    );
  }

}

IndexPage.propTypes = {
};

export default IndexPage;
