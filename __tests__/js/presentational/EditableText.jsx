import React from 'react';
import EditableText from '../../../src/js/presentational/EditableText';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<EditableText
      text= 'hello'
      handleChangeComplete= { jest.fn() }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
