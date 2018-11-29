import React from 'react';
import MultiSelection from '../MultiSelection';

class MultiSelectionHarness extends React.Component {
  state = { msVal: this.props.value }

  handleChange = (value) => {
    this.setState({ msVal: value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    const {
      value, // eslint-disable-line
      onChange, // eslint-disable-line
      ...props
    } = this.props;

    return (
      <MultiSelection
        {...props}
        value={this.state.msVal}
        onChange={this.handleChange}
      />
    );
  }
}

export default MultiSelectionHarness;
