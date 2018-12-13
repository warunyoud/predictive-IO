import React from 'react';
import TabBarContainer from '../../../src/js/containers/TabBarContainer';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<TabBarContainer
      tabs={[{ index: 0, subIndex: -1, text: 'hello' }]}
      setCurrentTabIndex={ jest.fn()}
      currentTabIndex={0}
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
