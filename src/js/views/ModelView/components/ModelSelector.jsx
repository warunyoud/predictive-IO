import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import modelParameters from 'json/model_parameters.json';
import Select from 'react-select';
import fs from 'fs';

import { runPythonScript } from 'scripts/python-interface';

import WizardRow from 'components/WizardRow';

class ModelSelector extends React.Component {
  constructor(props) {
    super(props);

    const dataset = props.dataset ? { label: props.dataset, value: `${process.env.workspacePath}/dataset/${props.dataset}` } : null;
    this.state = {
      selectedDataset: dataset,
      selectedModel: props.model ? { label: modelParameters[props.model].name, value: props.model } : null,
      selectedParameters: {},
      columns: dataset ? this.getColumnsFromFile(dataset.value) : [],
      selectedPredictingColumn: props.predictingColumn ? { label: props.predictingColumn, value: props.predictingColumn } : null ,
      selectedFeatures: _.map(props.features, feature => ({ label: feature, value: feature }))
    };
  }

  getConfig() {
    return {
      dataset_name: this.state.selectedDataset.label,
      dataset_path: `${this.state.selectedDataset.value}/data.csv`,
      predicting_column: this.state.selectedPredictingColumn.label,
      selected_features: _.map(this.state.selectedFeatures, feature => feature.label),
      model: this.state.selectedModel.value
    }
  }

  setSelectedFeatures(features) {
    this.setState({ selectedFeatures: features });
  }

  spawnTrainingProcess(newPath) {
    const args = [
    newPath
    ]
    this.props.onProcessStarted();
    runPythonScript('src/python/train_model.py', args, this.props.onDataRecieved, this.props.onProcessFinished, 'text');
  }

  getColumnsFromFile(path) {
    return _.map(JSON.parse(fs.readFileSync(`${path}/graph.json`, 'utf8')), column => column.name );
  }

  setSelectedParameter(parameter, value) {
    const clonedSelectedParameters = this.state.selectedParameters;
    clonedSelectedParameters[parameter] = value;
    this.setState({ selectedParameters: clonedSelectedParameters });
  }

  getParameterInput(parameter, value) {
    switch(parameter.type) {
      case 'boolean':
        return (
          <Select
            placeholder={ parameter.optional ? `${parameter.type}, optional` : '-- Select a value --' }
            options={[{ label: 'true', value: true }, { label: 'false', value: false }]}
            onChange={ (option) => this.setSelectedParameter(parameter.name, option.value) }
            value={{ label: value ? 'true' : 'false', value: value }}
            />
        );
        break;
      case 'int':
        return (<input
            placeholder={ parameter.optional ? `${parameter.type}, optional` : '-- Select an integer --' }
            type='number'
            step='1'
            />
        );
        break;
    }
  }

  getParameters() {
    return (
      <div>
        <h3>Parameters</h3>
        {
          _.map(modelParameters[this.state.selectedModel.value].parameters, parameter =>
            <div className='model-wizard-row' key={`parameters-row-${parameter.name}`}>
              <div className='model-wizard-col-25' key={`parameters-col-25-${parameter.name}`}>
                <label>{parameter.name}</label>
              </div>
              <div className='model-wizard-col-75' key={`parameters-col-75-${parameter.name}`}>
                { this.getParameterInput(parameter, this.state.selectedParameters[parameter.name]) }
              </div>
            </div>
          )
        }
      </div>
    );
  }

  setSelectedDataset(selectedDataset) {
    this.setState({ selectedDataset, 
      columns: this.getColumnsFromFile(selectedDataset.value)
    });
  }

  setSelectedModel(selectedModel) {
    const selectedParameters = {}
    _.forEach(modelParameters[selectedModel.value].parameters, parameter => {
      selectedParameters[parameter.name] = parameter.default;
    });

    this.setState({ selectedModel: selectedModel, selectedParameters })
  }

  setSelectedPredictingColumn(selectedPredictingColumn) {
    const clonedSelectedFeatures = this.state.selectedFeatures;
    this.setState({ selectedPredictingColumn, selectedFeatures: _.reject(clonedSelectedFeatures, selectedPredictingColumn) })
  }

  render() {
    return (
      <div>
        <h3>Data</h3>
        <WizardRow
          label='Dataset'
          value={ this.state.selectedDataset }
          options={ _.map(this.props.datasets, dataset => ({ value: `${process.env.workspacePath}/dataset/${dataset.text}`, label: dataset.text }))}
          setValue={ this.setSelectedDataset.bind(this) }
          />

        <WizardRow
          label='Predicting Column'
          value={ this.state.selectedPredictingColumn }
          options={ _.map(this.state.columns, (item) => ({ value: item, label: item })) }
          setValue={ this.setSelectedPredictingColumn.bind(this) }
          isDisabled={ this.state.selectedDataset == null }
          placeholder='-- Select a column to predict --'
          />

        <WizardRow
          label='Features'
          value={ this.state.selectedFeatures }
          options={ _.reject(_.map(this.state.columns, (item) => ({ value: item, label: item })), this.state.selectedPredictingColumn) }
          setValue={ this.setSelectedFeatures.bind(this) }
          isDisabled={ this.state.selectedDataset == null }
          isMulti
          placeholder='-- Select columns to extract features --'
          />

        <h3>Model</h3>
        <WizardRow
          label='Model Type'
          value={ this.state.selectedModel }
          placeholder='-- Select a machine learning model --'
          setValue={ this.setSelectedModel.bind(this) }
          options={ _.map(modelParameters, (model, key) => ({ value: key, label: model.name })) }
          />

        { this.state.selectedModel && this.getParameters() }
      </div>

    );
  }
}

ModelSelector.propTypes = {
  datasets: PropTypes.array.isRequired,
  dataset: PropTypes.string,
  predictingColumn: PropTypes.string,
  features: PropTypes.array,
  model: PropTypes.string
}

export default ModelSelector;
