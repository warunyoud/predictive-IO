import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import fs from 'fs';

import { runPythonScript } from 'scripts/python-interface';
import { listDirItems, getUniqueFolderName } from 'scripts/file-utilities';

import ModelSelector from './components/ModelSelector';

class ModelViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  saveModelConfig() {
    const modelPath = `${process.env.workspacePath}/models`;
    const files = listDirItems(modelPath);
    const config = this._modelSelector.getConfig();
    config['name'] = getUniqueFolderName('model', files);

    const newPath = `${modelPath}/${config.name}`;
    fs.mkdirSync(newPath);
    const jsonConfig = JSON.stringify(config);
    fs.writeFileSync(`${newPath}/config.json`, jsonConfig, 'utf8');
    this.spawnTrainingProcess(newPath);
  }

  spawnTrainingProcess(newPath) {
    const args = [
      newPath
    ]
    this.props.onProcessStarted();
    runPythonScript('src/python/train_model.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
  }


  render() {
    return (
      <div>
        <h1>Create a New Training Model</h1>
        <ModelSelector
          datasets={ this.props.datasets }
          ref={ modelSelector => { this._modelSelector = modelSelector }}
          /> 
        <button
          className='apply-change-button'
          onClick={ () => this.saveModelConfig() }
          >
          Start Training
        </button>
      </div>

    );
  }
}

ModelViewContainer.propTypes = {
  datasets: PropTypes.array.isRequired,
  onProcessStarted: PropTypes.func.isRequired,
  onDataRecieved: PropTypes.func.isRequired,
  onProcessFinished: PropTypes.func.isRequired
}

export default ModelViewContainer;
