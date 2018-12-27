import React from 'react';
import PropTypes from 'prop-types';

import MultiSelection from '../MultiSelection';

export default class MultiSelectionFilter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
    })).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    selectedValues: [],
  }

  onChangeHandler = (selectedOptions) => {
    const {
      name,
      onChange,
    } = this.props;

    onChange({
      name,
      values: selectedOptions.map((option) => option.value),
    });
  };

  getSelectedOptions() {
    const {
      selectedValues,
      options,
    } = this.props;

    return selectedValues
      .map((curValue) => options.find((curAvailableValue) => curAvailableValue.value === curValue));
  }

  render() {
    const {
      options,
    } = this.props;

    return (
      <MultiSelection
        {...this.props}
        dataOptions={options}
        value={this.getSelectedOptions()}
        onChange={this.onChangeHandler}
      />
    );
  }
}
