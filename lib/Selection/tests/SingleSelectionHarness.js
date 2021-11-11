import React from 'react';
import PropTypes from 'prop-types';
import Selection from '../Selection';

class SingleSelectionHarness extends React.Component {
  static propTypes = {
    initValue: PropTypes.string,
    label: PropTypes.node,
    options: PropTypes.arrayOf(PropTypes.object),
  }

  constructor(props) {
    super(props);

    this.state = {
      fieldVal: props.initValue,
    };
  }

  render() {
    return (
      <Selection
        label={this.props.label}
        value={this.state.fieldVal}
        dataOptions={this.props.options}
        onChange={(val) => { this.setState({ fieldVal: val }); }}
      />
    );
  }
}

export default SingleSelectionHarness;
