/*
  Basic harness prop for testing redux-form functionality
  children should be a <Field> component with the tested component passed
  as the 'component' prop.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

class TestForm extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return this.props.children;
  }
}

export default reduxForm({
  form: 'formsDemo'
})(TestForm);
