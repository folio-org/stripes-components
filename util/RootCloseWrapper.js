/**
 * RootCloseWrapper
 *
 * This is a replacement for the react-overlays <RootCloseWrapper> component which is deprecated.
 * It's only used for class components that does not support using the useRootClose hook.
 */

import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import useClickOutside from '../hooks/useClickOutside';

const RootCloseWrapper = forwardRef(({ children, onRootClose = noop, disabled }, ref) => {
  const handleOutsideClick = useCallback((e, outside) => outside && onRootClose(e), [onRootClose]);
  useClickOutside(
    ref,
    disabled ? noop : handleOutsideClick,
  );

  return children;
});

RootCloseWrapper.propTypes = {
  children: PropTypes.node, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  onRootClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
};

RootCloseWrapper.defaultProps = {
  disabled: false,
};

export default RootCloseWrapper;
