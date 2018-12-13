import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme, VictoryPie } from 'victory';

class ColumnGraphRow extends React.Component {
  getDataRange(data) {
    const values = _.map(data, (item) => item.x)
    return [_.min(values), _.max(values)];
  }

  getTickFormat(data, key, tick) {
    const maxValues = _.max(_.map(data, (item) => item[key]))
    if (maxValues > 100000000) {
      return (tick) => `${Math.round(tick / 1000000)}m`;
    } else if (maxValues > 10000) {
      return (tick) => `${Math.round(tick / 1000)}k`;
    } else {
      return (tick) => tick;
    }
  }

  generateGraph() {
    const { data, name, uniques, type } = this.props.graphItem;
    if (type == 'numerical') {
      return (
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={10}
          key={ `graph-chart-${name}` }
        >
          <VictoryAxis
            key={ `graph-axis-${name}` }
            tickFormat={this.getTickFormat(data, 'x')}
          />
          <VictoryAxis
            dependentAxis
            key={ `graph-axis-dependent-${name}` }
            tickFormat={this.getTickFormat(data, 'y')}
          />
          <VictoryBar
            style={{ data: { fill: '#c43a31' }}}
            data={data}
            alignment="start"
            barRatio={1.0}
            key={ `graph-bar-${name}` }
          />
        </VictoryChart>
      );
    } else {
      if (data.length == 1 && data[0].x == 'others') {
        return (
          <h1 style={{ fontSize: 46, textAlign: 'center', color: '#c43a31' }}>{ uniques } unique values</h1>
        )
      } else {
        return (
          <VictoryPie
            key={ `graph-pie-${name}` }
            data={data}
          />
        );
      }
    }
  }

  render() {
    if (this.props.removed){
      return null;
    }

    const { name } = this.props.graphItem;
    const index = this.props.index;

    return (
      <div key={ `graph-item-${name}` } style={{borderTop: 'groove'}}>
        <div style={{display: 'flex'}}>
          <h3 key={ `graph-header-${name}` }> { index != null ? `#${index+1} : ${ name }` : name }</h3>
        </div>
        <div key={ `graph-${name}` } style={{height: '350px'}} >
          { this.generateGraph() }
        </div>
      </div>
    );
  }
}

ColumnGraphRow.propTypes = {
  graphItem: PropTypes.object.isRequired,
  index: PropTypes.number,
  removed: PropTypes.bool.isRequired
}

export default ColumnGraphRow;
