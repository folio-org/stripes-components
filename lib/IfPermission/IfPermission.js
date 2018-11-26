import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes-core/src/StripesContext';

class IfPermission extends Component {
  constructor(props) {
    super(props);

    console.warn(
      'Warning: <IfPermission> is deprecated and will be removed in the\n' +
           'next major version of @folio/stripes/components.\n\n' +
           'Import from @folio/stripes/core instead:\n' +
           'https://github.com/folio-org/stripes-core/tree/master/src/components/IfPermission\n'
    );
  }

  render() {
    const {
      children,
      perm,
      stripes
    } = this.props;

    return stripes.hasPerm(perm) ? children : null;
  }
}

IfPermission.propTypes = {
  children: PropTypes.node,
  perm: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func,
  }),
};

export default withStripes(IfPermission);
