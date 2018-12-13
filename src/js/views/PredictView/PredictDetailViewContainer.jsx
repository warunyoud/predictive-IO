import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import fs from 'fs';
import { EditableText, ColumnGraphRow } from 'components';

const { ipcRenderer } = window.require('electron');

class PredictDetailViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: null,
      title: props.folderName
    }
  }

  getGraphFromFile(props) {
    const path = `${process.env.workspacePath}/predictions/${props.folderName}/graph.json`;
    const graph =  JSON.parse(fs.readFileSync(path, 'utf8'));
    graph.removed = false;
    this.setState({ graph });
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

  exportFile() {
    const path = `${process.env.workspacePath}/predictions/${this.props.folderName}/output.csv`;
    ipcRenderer.send('open-export-dialog', path);
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
            <button className='apply-change-button'>Apply Changes</button>
          </div>
        </div>
        <h2> Prediction Graph </h2>
        <ColumnGraphRow
          graphItem={this.state.graph}
          removed={false}
          />
        <button
          className='apply-change-button'
          onClick={ () => this.exportFile() }
          >
          Export CSV
        </button>
      </div>
    );
  }
}

PredictDetailViewContainer.propTypes = {
  folderName: PropTypes.string.isRequired,
}

export default PredictDetailViewContainer;
