import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes-core/src/StripesContext';

const IfPermission = (props) => (
  props.stripes.hasPerm(props.perm) ? props.children : null
);

IfPermission.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func,
  }),
};

export default withStripes(IfPermission);
