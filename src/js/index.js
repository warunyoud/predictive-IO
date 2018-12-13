import React from 'react';
import ReactDOM from 'react-dom';

import MainViewContainer from 'views/MainViewContainer';

import '../css/style.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import userPreference from 'json/user_preference.json';

process.env.workspacePath = userPreference.workspacePath;

ReactDOM.render(
  <MainViewContainer/>,
  document.getElementById('app')
);
