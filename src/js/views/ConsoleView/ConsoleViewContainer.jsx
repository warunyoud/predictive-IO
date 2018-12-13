import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';
import MDSpinner from 'react-md-spinner';

import PerfectScrollbar from 'react-perfect-scrollbar';

const DEFAULT_MSG = [
  'Welcome to the terminal',
  'Here you can view all the outputs'
];

class ConsoleViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accept: '',
      files: [],
      dropzoneActive: false,
      loadingMessage: ''
    }
  }

  render() {
    return (
      <div>
        <h1>Console Log</h1>
        <div className='terminal-container'>
          <PerfectScrollbar>
              { _.map(_.concat(DEFAULT_MSG, this.props.consoleMessage), (message, index) => (
                <li key={`message-${index}`}> { `line ${index}: > ${message}` } </li>
              ))}
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}

ConsoleViewContainer.propTypes = {
  consoleMessage: PropTypes.array.isRequired
}

export default ConsoleViewContainer;
