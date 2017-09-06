import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from './index';

const UncontrolledDropdown = Component => class extends React.PureComponent {
  static propTypes = {
    onToggle: PropTypes.func,
    onSelect: PropTypes.func,
  }
  constructor(props) {
    super(props);

    this.state = { open: false };

    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(e) {
    this.setState({ open: !this.state.open });
    if (e.target.type === 'button') {
      this.props.onSelect(e);
    }
  }

  onToggle(e) {
    this.setState({ open: !this.state.open });
    this.props.onToggle(e);
  }

  render() {
    const props = Object.assign({}, this.props, { onToggle: this.onToggle }, { onSelect: this.onSelect });
    return (
      <Component open={this.state.open} onToggle={this.onToggle} onSelect={this.onSelect} {...props} />
    );
  }
};


export default UncontrolledDropdown(Dropdown);
