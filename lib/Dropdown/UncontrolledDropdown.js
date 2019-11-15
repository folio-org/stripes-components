import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from './index';

const UncontrolledDropdown = Component => class extends React.PureComponent {
  static propTypes = {
    onSelectItem: PropTypes.func,
    onToggle: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    // eslint-disable-next-line
    console.warn('This component, <UncontrolledDropdown> is deprecated and will be removed in future versions of stripes-components. Use <Dropdown> instead.');
  }

  handleSelect(...data) {
    this.setState(prevState => ({ open: !prevState.open }));
    if (this.props.onSelectItem) {
      this.props.onSelectItem(...data);
    }
  }

  handleToggle(e) {
    this.setState(prevState => ({ open: !prevState.open }));
    if (this.props.onToggle) {
      this.props.onToggle(e);
    }
  }

  render() {
    const props = Object.assign({}, this.props, { onToggle: this.handleToggle, onSelectItem: this.handleSelect });
    return (
      <Component open={this.state.open} {...props} />
    );
  }
};


export default UncontrolledDropdown(Dropdown);
