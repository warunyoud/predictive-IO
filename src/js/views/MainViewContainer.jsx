import _ from 'lodash';
import React from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { TabBar, SideNavbar } from 'components';
import { listDirItems } from 'scripts/file-utilities';

import { DataViewContainer, DataDetailViewContainer } from 'views/DataView';
import { ModelViewContainer, ModelDetailViewContainer } from 'views/ModelView';
import { PredictViewContainer, PredictDetailViewContainer } from 'views/PredictView';
import { ConsoleViewContainer } from 'views/ConsoleView';

const MENU_INDEX = {
  DATA: 0,
  TRAIN: 1,
  PREDICT: 2,
  CONSOLE: 3
};

const MENU_TEXT = [ 'data', 'train', 'predict', 'console' ];

class MainViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      subIndex: -1,
      navbarItems: [
        { icon: 'storage', text: 'Dataset', subbars: [], loading: false },
        { icon: 'layers', text: 'Train', subbars: [], loading: false },
        { icon: 'gps_fixed', text: 'Predict', subbars: [], loading: false },
        { icon: 'code', text: 'Console', subbars: [], loading: false },
      ],
      tabs: [{ index: 0, subIndex: -1, text: this.getTabName(0, -1) }],
      currentTabIndex: 0,
      dataSettingOriginal: [],
      dataSettingCache: [],
      modelSettingOriginal: [],
      modelSettingCache: [],
      consoleMessage: []
    }
  }

  selectNavbarIndex(index, subIndex, permanent) {
    let clonedTabs = _.cloneDeep(this.state.tabs);
    const text = this.getTabName(index, subIndex);
    const matchIndex = _.findIndex(clonedTabs, item =>
      _.isEqual(
        _.pick(item, ['index', 'subIndex', 'permanent']),
        { index, subIndex, permanent: true }
      )
    );
    if (matchIndex >= 0) {
      this.setState({ currentTabIndex: matchIndex });
      return;
    }
    const newItem = { index, subIndex, permanent, text };
    const lastIndex = clonedTabs.length - 1;
    let currentTabIndex = lastIndex;
    if (permanent) {
      clonedTabs[lastIndex] = newItem;
    } else {
      if (clonedTabs[lastIndex].permanent) {
        clonedTabs = _.concat(clonedTabs, newItem);
        currentTabIndex += 1
      } else {
        clonedTabs[lastIndex] = newItem;
      }
    }
    this.setState({ index, subIndex, currentTabIndex, tabs: clonedTabs });
  }

  refreshNavbarSubItems() {
    const datasetPath = `${process.env.workspacePath}/dataset`;
    const datasetFiles = listDirItems(datasetPath)
    const modelPath = `${process.env.workspacePath}/models`;
    const modelFiles = listDirItems(modelPath)
    const predictPath = `${process.env.workspacePath}/predictions`;
    const predictFiles = listDirItems(predictPath)
    const clonedState = _.cloneDeep(this.state);
    clonedState.navbarItems[MENU_INDEX.DATA].subbars = _.map(datasetFiles, file => { return { text: file, unsaved: false} });
    clonedState.navbarItems[MENU_INDEX.TRAIN].subbars = _.map(modelFiles, file => { return { text: file, unsaved: false} });
    clonedState.navbarItems[MENU_INDEX.PREDICT].subbars = _.map(predictFiles, file => { return { text: file, unsaved: false} });
    clonedState.dataSettingCache = _.map(datasetFiles, file => { return {} });
    clonedState.dataSettingOriginal = _.map(datasetFiles, file => { return { title: file } });
    this.setState(clonedState);
  }

  getMainContent() {
    const { index, subIndex } = this.state.tabs[this.state.currentTabIndex];
    switch(index) {
      case MENU_INDEX.DATA:
        if (subIndex < 0) {
          return (
            <DataViewContainer
              onProcessStarted={ this.dataOnProcessStarted.bind(this) }
              onDataRecieved={ this.onDataRecieved.bind(this) }
              onProcessFinished={ this.dataOnProcessFinished.bind(this) }
              />
          );
        } else {
          return (
            <DataDetailViewContainer
              dataset={this.state.navbarItems[MENU_INDEX.DATA].subbars[subIndex].text}
              saveDataSetting={this.saveDataSetting.bind(this)}
              settingCache={this.state.dataSettingCache[subIndex]}
              />
          );
        }
      case MENU_INDEX.TRAIN:
        if (subIndex < 0) {
          return (
            <ModelViewContainer
              datasets={ this.state.navbarItems[MENU_INDEX.DATA].subbars }
              onProcessStarted={ this.modelOnProcessStarted.bind(this) }
              onDataRecieved={ this.onDataRecieved.bind(this) }
              onProcessFinished={ this.modelOnProcessFinished.bind(this) }
              />
          );
        } else {
          return (
            <ModelDetailViewContainer
              datasets={ this.state.navbarItems[MENU_INDEX.DATA].subbars }
              model={ this.state.navbarItems[MENU_INDEX.TRAIN].subbars[subIndex].text }
              onDataRecieved={ this.onDataRecieved.bind(this) }
              onProcessFinished={ this.modelOnProcessFinished.bind(this) }
              />
          );
        }
      case MENU_INDEX.PREDICT:
        if (subIndex < 0) {
          return (
            <PredictViewContainer
              models={ this.state.navbarItems[MENU_INDEX.TRAIN].subbars }
              onProcessStarted={ this.predictOnProcessStarted.bind(this) }
              onDataRecieved={ this.onDataRecieved.bind(this) }
              onProcessFinished={ this.predictOnProcessFinished.bind(this) }
              />);
        } else {
          return (
            <PredictDetailViewContainer
              folderName={ this.state.navbarItems[MENU_INDEX.PREDICT].subbars[subIndex].text }
              />);
        }
      case MENU_INDEX.CONSOLE:
        return (
          <ConsoleViewContainer
            consoleMessage={ this.state.consoleMessage }
            />);
    }
  }

  onProcessStarted(index) {
    const clonedState = _.cloneDeep(this.state);
    clonedState.navbarItems[index].loading = true;
    this.setState(clonedState);
  }

  dataOnProcessStarted() {
    this.onProcessStarted(MENU_INDEX.DATA);
  }

  modelOnProcessStarted() {
    this.onProcessStarted(MENU_INDEX.TRAIN);
  }

  predictOnProcessStarted() {
    this.onProcessStarted(MENU_INDEX.PREDICT);
  }

  onDataRecieved(data) {
    const clonedConsoleMessage = _.concat(this.state.consoleMessage, data);
    this.setState({
      consoleMessage: clonedConsoleMessage
    });
  }

  onProcessFinished(index) {
    this.refreshNavbarSubItems();
    const clonedState = _.cloneDeep(this.state);
    clonedState.navbarItems[index].loading = false;
    this.setState(clonedState);
  }

  dataOnProcessFinished(err, signal, code) {
    this.onProcessFinished(MENU_INDEX.DATA);
  }

  modelOnProcessFinished(err, signal, code) {
    this.onProcessFinished(MENU_INDEX.TRAIN);
  }

  predictOnProcessFinished(err, signal, code) {
    this.onProcessFinished(MENU_INDEX.PREDICT);
  }

  componentDidMount() {
    this.refreshNavbarSubItems();
  }

  setCurrentTabIndex(currentTabIndex) {
    this.setState({ currentTabIndex })
  }

  getTabName(index, subIndex) {
    if (subIndex == -1) {
      return MENU_TEXT[index];
    } else {
      return this.state.navbarItems[index].subbars[subIndex].text;
    }
  }

  //SubdataView
  saveDataSetting(key, value) {
    const clonedDataSettingCache = _.cloneDeep(this.state.dataSettingCache);
    const clonedNavbarItems = _.cloneDeep(this.state.navbarItems);
    const subIndex = this.state.subIndex;
    clonedDataSettingCache[subIndex][key] = value;
    clonedNavbarItems[0].subbars[subIndex].unsaved = !_.isEqual(clonedDataSettingCache[subIndex], this.state.dataSettingOriginal[subIndex]);
    this.setState({ dataSettingCache: clonedDataSettingCache, navbarItems: clonedNavbarItems });
  }

  render() {
    const { index, subIndex } = this.state.tabs[this.state.currentTabIndex];
    return (
      <div>
        <SideNavbar
          items={this.state.navbarItems}
          index={index}
          subIndex={subIndex}
          selectIndex={this.selectNavbarIndex.bind(this)}
        />
        <div className='main-content'>
          <TabBar
            tabs={this.state.tabs}
            setCurrentTabIndex={this.setCurrentTabIndex.bind(this)}
            currentTabIndex={this.state.currentTabIndex}
            />
          <PerfectScrollbar>
            <div style={{ padding: '50px'}}>
              { this.getMainContent() }
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}

export default MainViewContainer;
