import React from 'react';
import DataViewContainer from '../../../src/js/containers/DataViewContainer';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<DataViewContainer
      onProcessStarted={ jest.fn() }
      onDataRecieved={ jest.fn() }
      onProcessFinished={ jest.fn() }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
