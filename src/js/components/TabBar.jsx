import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

class TabBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='tab-bar'>
        {
          _.map(this.props.tabs, (tab, index) => {
            let className = this.props.currentTabIndex == index ? 'tab-item' : 'tab-item-unselected';
            if (!tab.permanent) {
              className += ' tab_italic';
            }
            return (
              <div
                className={ className }
                onClick={ () => this.props.setCurrentTabIndex(index) }
                key={ `tab-bar-${index}`}>
                { tab.text }
              </div>
            );
          })
        }
      </div>
    );
  }
}

TabBar.propTypes = {
  tabs: PropTypes.array.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  setCurrentTabIndex: PropTypes.func.isRequired
}

export default TabBar;
