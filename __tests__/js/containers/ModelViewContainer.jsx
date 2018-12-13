import React from 'react';
import ModelViewContainer from '../../../src/js/containers/ModelViewContainer';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<ModelViewContainer
      datasets={ [{ text: 'regression' }] }
      onProcessStarted={ jest.fn() }
      onDataRecieved={ jest.fn()  }
      onProcessFinished={ jest.fn()  }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
