/**
 * RootCloseWrapper
 *
 * This is a replacement for the react-overlays <RootCloseWrapper> component which is deprecated.
 * It's only used for class components that does not support using the useRootClose hook.
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useOnClickOutside } from 'usehooks-ts';
import noop from 'lodash/noop';

const RootCloseWrapper = forwardRef(({ children, onRootClose = noop, disabled }, ref) => {
  useOnClickOutside(
    ref,
    disabled ? noop : onRootClose,
    'click'
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
