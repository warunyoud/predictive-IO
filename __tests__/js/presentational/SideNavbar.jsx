import React from 'react';
import SideNavbar from '../../../src/js/presentational/SideNavbar';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const navbarItems = [
    { icon: 'storage', text: 'Dataset', subbars: [], loading: false },
    { icon: 'layers', text: 'Train', subbars: [], loading: false },
    { icon: 'gps_fixed', text: 'Predict', subbars: [], loading: false },
    { icon: 'assessment', text: 'Evaluate', subbars: [], loading: false },
    { icon: 'code', text: 'Console', subbars: [], loading: false },
  ]
  const tree = renderer
    .create(<SideNavbar
      items={ navbarItems }
      index={ 0 }
      subIndex={ 0 }
      selectIndex={ jest.fn() }
      selectSubIndex={ jest.fn() }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
