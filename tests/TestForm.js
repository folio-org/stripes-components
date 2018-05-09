/*
  Basic harness prop for testing redux-form functionality
  children should be a <Field> component with the tested component passed
  as the 'component' prop.
*/

import React from 'react';
import { reduxForm } from 'redux-form';

function validate(values) {
  const errors = {};

  if (values.testField === "invalid") {
    errors.testField = 'testField is Invalid';
  }
  return errors;
}

class TestForm extends React.Component {
  render() {
    return this.props.children;
  }
}

export default reduxForm({
  form: 'formsDemo',
  validate
})(TestForm);
