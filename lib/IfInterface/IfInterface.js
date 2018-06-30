import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes-core/src/StripesContext';

const IfInterface = (props) => (
  props.stripes.hasInterface(props.name, props.version) ? props.children : null
);

IfInterface.propTypes = {
  name: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func,
  }),
  version: PropTypes.string,
};

export default withStripes(IfInterface);
