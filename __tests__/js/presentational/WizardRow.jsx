import React from 'react';
import WizardRow from '../../../src/js/presentational/WizardRow';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<WizardRow
      label='hello'
      options={ [{ label: 'foo', value: 'bar' }] }
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
