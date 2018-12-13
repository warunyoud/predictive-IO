import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';
import { runPythonScript } from 'scripts/python-interface';

class DataViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accept: '',
      files: [],
      dropzoneActive: false,
      loadingMessage: ''
    }
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    const args = [
      `${process.env.workspacePath}/dataset`,
      _.map(files, (file) => file.path)
    ]
    runPythonScript('src/python/add_dataset.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
    this.props.onProcessStarted();
    this.setState({
      files,
      dropzoneActive: false,
    });
  }

  render() {
    const overlayStyle = {
      color: 'rgba(0,0,0,0.15)',
      border: 'solid',
    };
    return (
      <div>
        <h1>Input a Data</h1>
        <h2>Adding Files</h2>
        <Dropzone
          className='dropzone'
          style={this.state.dropzoneActive ? overlayStyle : null}
          accept={this.state.accept}
          onDrop={this.onDrop.bind(this)}
          onDragEnter={this.onDragEnter.bind(this)}
          onDragLeave={this.onDragLeave.bind(this)}
          >
          <div style={{position: 'absolute', top: '35%', width: '100%', textAlign: 'center'}}>
            <i className='material-icons dropzone-icon'>file_upload</i>
            <h2>Drop files here or click to upload.</h2>
          </div>
        </Dropzone>
      </div>

    );
  }
}

DataViewContainer.propTypes = {
  onProcessStarted: PropTypes.func.isRequired,
  onDataRecieved: PropTypes.func.isRequired,
  onProcessFinished: PropTypes.func.isRequired
}

export default DataViewContainer;
