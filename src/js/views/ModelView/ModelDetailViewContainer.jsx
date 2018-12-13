import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import fs from 'fs';

import { EditableText } from 'components';
import { runPythonScript } from 'scripts/python-interface';

import ModelSelector from './components/ModelSelector';


class ModelDetailViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      info: {},
      config: {},
      num_fold: 5
    }
  }

  getGraphFromFile(props) {
    const path = `${process.env.workspacePath}/models/${props.model}`;
    const config =  JSON.parse(fs.readFileSync(`${path}/config.json`, 'utf8'));
    const info =  JSON.parse(fs.readFileSync(`${path}/info.json`, 'utf8'));
    this.setState({ info, config, title: config.name });
  }

  componentWillMount() {
    this.getGraphFromFile(this.props);
  }

  componentWillReceiveProps(props) {
    this.getGraphFromFile(props);
  }

  setTitle(title) {
    this.setState({ title });
  }

  spawnCrossValidation() {
    const args = [
      `${process.env.workspacePath}/models/${this.props.model}`,
      this.state.num_fold
    ]
    runPythonScript('src/python/cross_validation.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
  }

  saveModelConfig() {
    const modelPath = `${process.env.workspacePath}/models`;
    const config = this._modelSelector.getConfig();
    config['name'] = this.props.model;
    const path = `${modelPath}/${this.props.model}`;
    const jsonConfig = JSON.stringify(config);
    fs.writeFileSync(`${path}/config.json`, jsonConfig, 'utf8');
    this.spawnTrainingProcess(path);
  }

  spawnTrainingProcess(path) {
    const args = [
      path
    ]
    runPythonScript('src/python/train_model.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
  }

  getCrossValidationDisplay() {
    if (this.state.info.cross_validation_rms) {
      return (
        <li>Average RMS: {this.state.info.cross_validation_rms}</li>
      );
    } else {
      return (
        <div>
          <div className='model-wizard-row'>
            <div className='model-wizard-col-25'>
              <label>Number of fold</label>
            </div>
            <div className='model-wizard-col-75'>
              <input
                placeholder={ '-- Select an integer --' }
                type='number'
                onChange={ event => this.setState({ num_fold: event.target.value })}
                value={ this.state.num_fold }
                step='1'
              />
            </div>
          </div>
          <button className='apply-change-button' onClick={ () => this.spawnCrossValidation() }>Calculate</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className='data-visualization-header'>
          <EditableText
            text={this.state.title}
            handleChangeComplete={ (title) => this.setTitle(title) }
            />
          <div className='apply-change-button-container'>
            <button 
              className='apply-change-button'
              onClick={ () => this.saveModelConfig() }>
              Retrain
            </button>
          </div>
        </div>
        <h2>Config</h2>
        <ModelSelector
          datasets={ this.props.datasets }
          dataset={ this.state.config.dataset_name }
          model={ this.state.config.model }
          predictingColumn={ this.state.config.predicting_column }
          features={ this.state.config.selected_features }
          ref={ modelSelector => { this._modelSelector = modelSelector } }
          />
        <div>
          <h2>Performance</h2>
          <h3>Training Accuracy</h3>
          <li>RMS: {this.state.info.training_rms}</li>
          <h3>Cross Validation</h3>
          { this.getCrossValidationDisplay() }
        </div>
      </div>
    );
  }
}

ModelDetailViewContainer.propTypes = {
  datasets: PropTypes.array.isRequired,
  model: PropTypes.string.isRequired,
  onDataRecieved: PropTypes.func.isRequired,
  onProcessFinished: PropTypes.func.isRequired
}

export default ModelDetailViewContainer;
