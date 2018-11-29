import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes-core/src/StripesContext';

class IfInterface extends Component {
  constructor(props) {
    super(props);

    console.warn(
      'Warning: <IfInterface> is deprecated and will be removed in the\n' +
           'next major version of @folio/stripes/components.\n\n' +
           'Import from @folio/stripes/core instead:\n' +
           'https://github.com/folio-org/stripes-core/tree/master/src/components/IfInterface\n'
    );
  }

  render() {
    const {
      children,
      name,
      stripes,
      version
    } = this.props;

    return stripes.hasInterface(name, version) ? children : null;
  }
}

IfInterface.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func,
  }),
  version: PropTypes.string,
};

export default withStripes(IfInterface);
