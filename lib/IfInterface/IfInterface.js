import _ from 'lodash';
import PropTypes from 'prop-types';

const IfInterface = (props, context) => {
  return (context.stripes.hasInterface(props.name, props.version) ? props.children : null);
}

IfInterface.contextTypes = {
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
  }).isRequired,
};

IfInterface.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
};

export default IfInterface;
