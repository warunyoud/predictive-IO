import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import fs from 'fs';
import Dropzone from 'react-dropzone';

import { runPythonScript } from 'scripts/python-interface';
import { listDirItems, getUniqueFolderName } from 'scripts/file-utilities';

import { WizardRow } from 'components';

class PredictViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accept: '',
      files: [],
      dropzoneActive: false,
      selectedModel: null
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
    this.setState({
      files,
      dropzoneActive: false,
    });
  }

  setSelectedModel(selectedModel) {
    this.setState({ selectedModel: selectedModel.value })
  }

  makePredictions() {
    const predictPath = `${process.env.workspacePath}/predictions`;
    const files = listDirItems(predictPath);
    const newPath = `${predictPath}/${getUniqueFolderName('predict', files)}`
    fs.mkdirSync(newPath);
    const args = [
      this.state.selectedModel,
      this.state.files[0].path,
      newPath
    ]
    this.props.onProcessStarted();
    runPythonScript('src/python/predict_data.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
  }

  render() {
    const overlayStyle = {
      color: 'rgba(0,0,0,0.15)',
      border: 'solid',
    };
    return (
      <div>
        <h1>Testing / Prediction</h1>
        <h2>Trained Model</h2>
        <WizardRow
          label='Model to Use'
          options={ _.map(this.props.models, model => ({ value: `${process.env.workspacePath}/models/${model.text}`, label: model.text }))}
          setValue={ this.setSelectedModel.bind(this) }
          />

        <h2>Testing Dataset</h2>
        {
          this.state.files.length == 0 ?
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
          </Dropzone> :
          <h3> { this.state.files[0].path } </h3>
        }
        <button
          className='apply-change-button'
          onClick={ () => this.makePredictions() }
          >
          Make Predictions
        </button>
      </div>

    );
  }
}

PredictViewContainer.propTypes = {
  models: PropTypes.array.isRequired,
  onProcessStarted: PropTypes.func.isRequired,
  onDataRecieved: PropTypes.func.isRequired,
  onProcessFinished: PropTypes.func.isRequired
}

export default PredictViewContainer;
