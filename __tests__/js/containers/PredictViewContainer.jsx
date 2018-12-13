import React from 'react';
import PredictViewContainer from '../../../src/js/containers/PredictViewContainer';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<PredictViewContainer
      models={ [{ text: 'regression' }] }
      onProcessStarted={ jest.fn() }
      onDataRecieved={ jest.fn()  }
      onProcessFinished={ jest.fn()  }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
