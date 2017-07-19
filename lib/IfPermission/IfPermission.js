import PropTypes from 'prop-types';

const IfPermission = (props, context) => (
  context.stripes.hasPerm(props.perm) ? props.children : null
);

IfPermission.contextTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default IfPermission;
