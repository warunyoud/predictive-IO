import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';

class WizardRow extends React.Component {

  render() {
    return (
      <div className='model-wizard-row' key={`parameters-row-${this.props.label}`}>
        <div className='model-wizard-col-25' key={`parameters-col-25-${this.props.label}`}>
          <label>{ this.props.label }</label>
        </div>
        <div className='model-wizard-col-75' key={`parameters-col-75-${this.props.label}`}>
          <Select
            options={ this.props.options }
            onChange={ (option) => this.props.setValue(option) }
            value={ this.props.value }
            isDisabled={ this.props.isDisabled }
            isMulti={ this.props.isMulti }
            placeholder={ this.props.placeholder }
            />
        </div>
      </div>
    );
  }
}

WizardRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  options: PropTypes.array.isRequired,
  setValue: PropTypes.func,
  isDisabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string
}

export default WizardRow;
