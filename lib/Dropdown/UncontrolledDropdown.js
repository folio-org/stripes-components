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

  onSelect(...data) {
    this.setState({ open: !this.state.open });
    if (this.props.onSelect) {
      this.props.onSelect(...data);
    }
  }

  onToggle(e) {
    this.setState({ open: !this.state.open });
    if (this.props.onToggle) {
      this.props.onToggle(e);
    }
  }

  render() {
    const props = Object.assign({}, this.props, { onToggle: this.onToggle }, { onSelect: this.onSelect });
    return (
      <Component open={this.state.open} {...props} />
    );
  }
};


export default UncontrolledDropdown(Dropdown);
