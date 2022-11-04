import PropTypes from 'prop-types';
import useDynamicLocale from './useDynamicLocale';

const DynamicLocaleRenderer = ({ children }) => {
  const { localeLoaded } = useDynamicLocale();

  return localeLoaded ? children : null;
};

DynamicLocaleRenderer.propTypes = {
  children: PropTypes.node
};

export default DynamicLocaleRenderer;
