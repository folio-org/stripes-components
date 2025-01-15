import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useDynamicLocale from './useDynamicLocale';

const DynamicLocaleRenderer = ({ children, onLoaded }) => {
  const { localeLoaded, isEnglishLang } = useDynamicLocale();
  useEffect(() => {
    if (localeLoaded) {
      onLoaded({ isEnglishLang });
    }
  }, [localeLoaded, onLoaded, isEnglishLang]);
  return localeLoaded ? children : null;
};

DynamicLocaleRenderer.propTypes = {
  children: PropTypes.node,
  onLoaded: PropTypes.func,
};

export default DynamicLocaleRenderer;
