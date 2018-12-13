import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import MDSpinner from 'react-md-spinner';


class SideNavbar extends React.Component {

  onItemClick(index, subIndex) {
    this.props.selectIndex(index, subIndex, false);
  }

  onItemDoubleClick(index, subIndex) {
    this.props.selectIndex(index, subIndex, true);
  }

  createListNavbarItem(item, index) {
    const mainBar = [
      <div
        className={this.props.index == index && this.props.subIndex < 0 ? 'side-navbar-item-highlighted' : null }
        key={`navbarItem-${item.text}`}
        onClick={() => this.onItemClick(index, -1)}
        onDoubleClick={() => this.onItemDoubleClick(index, -1)}
        >
        <i className="material-icons" key={`navbarIcon-${item.text}`}> {item.icon} </i>
        <a key={`navbarText-${item.text}`}> {item.text} </a>
        { item.loading && <MDSpinner className='side-navbar-spinner' size='20' singleColor='#708090'/> }
      </div>
    ]

    if (this.props.index == index) {
      return _.concat(mainBar, _.map(item.subbars, (subbar, subIndex) =>
        <div
          className={this.props.subIndex == subIndex ? 'side-navbar-item-highlighted' : null }
          key={`subbarItem-${item.text}-${subbar.text}`}
          onClick={() => this.onItemClick(index, subIndex)}
          onDoubleClick={() => this.onItemDoubleClick(index, subIndex)}
        >
          <a>{subbar.text}<sup>{subbar.unsaved ? '*' : '' }</sup></a>
        </div>
      ));
    } else {
      return mainBar;
    }
  }

  render() {
    return (
      <div className='side-navbar'>
        { _.map(this.props.items, (item, index) => this.createListNavbarItem(item, index)) }
      </div>
    );
  }
}

SideNavbar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
  subIndex: PropTypes.number.isRequired,
  selectIndex: PropTypes.func.isRequired,
}

export default SideNavbar;
