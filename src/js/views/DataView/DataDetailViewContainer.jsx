import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import fs from 'fs';

import { EditableText, ColumnGraphRow } from 'components';

class DataDetailViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: null,
      title: props.dataset
    }
  }

  getGraphFromFile(props) {
    const path = `${process.env.workspacePath}/dataset/${props.dataset}/graph.json`;
    const graph =  JSON.parse(fs.readFileSync(path, 'utf8'));
    _.forEach(graph, (item) => { item.removed = false; });
    this.setState({ graph, title: props.settingCache.title ? props.settingCache.title : props.dataset });
  }

  componentWillMount() {
    this.getGraphFromFile(this.props);
  }

  componentWillReceiveProps(props) {
    this.getGraphFromFile(props);
  }

  setTitle(title) {
    this.setState({ title });
    this.props.saveDataSetting('title', title);
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
        <h2> List of Columns </h2>
        { _.map(this.state.graph, (item, index) =>
          <ColumnGraphRow
            graphItem={item}
            index={index}
            removed={false}
            key={`column-graph-row-${index}`}
            />
          )

        }
      </div>
    );
  }
}

DataDetailViewContainer.propTypes = {
  dataset: PropTypes.string.isRequired,
  saveDataSetting: PropTypes.func.isRequired,
  settingCache: PropTypes.object.isRequired
}

export default DataDetailViewContainer;
