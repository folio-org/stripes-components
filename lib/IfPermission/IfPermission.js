import _ from 'lodash';
import PropTypes from 'prop-types';

const IfPermission = (props, context) => {
  return (context.stripes.hasPerm(props.perm) ? props.children : null);
}

IfPermission.contextTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default IfPermission;
