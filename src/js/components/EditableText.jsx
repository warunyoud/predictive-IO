import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class EditableText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      text: props.text
    }

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ text: props.text });
  }

  onPenClick() {
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeyPress);
    this.setState({ focus: true });
  }

  unFocusInput() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyPress);
    this.setState({ focus: false });
  }



  handleInputChange(event) {
    const target = event.target;
    this.setState({ text: target.value });
  }

  handleKeyPress(event) {
    if (event.keyCode == 27 || event.keyCode == 13) {
      this.unFocusInput();
      if (event.keyCode == 13 && this.props.handleChangeComplete) {
        this.props.handleChangeComplete(this.state.text);
      } else {
        this.setState({ text: this.props.text });
      }
    }
  }

  handleOutsideClick(event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.unFocusInput();
      this.setState({ text: this.props.text });
    }
  }

  render() {
    if (this.state.focus) {
      return (
        <input
          autoFocus
          value={ this.state.text }
          onChange={ this.handleInputChange.bind(this) }
          className='editable-text-input'
          type='text'/>
      );
    } else {
      return (
        <h1 className='editable-text'>
          {`${this.props.text} `}
          <span
            onClick={ () => this.onPenClick() }
            className='editable-text-pencil'>
            <i className="material-icons" style={{ color: 'gray' }}> edit </i>
          </span>
        </h1>
      );
    }
  }
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  handleChangeComplete: PropTypes.func,
}

export default EditableText;
