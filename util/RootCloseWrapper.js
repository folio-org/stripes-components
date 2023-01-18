/**
 * RootCloseWrapper
 *
 * This is a replacement for the react-overlays <RootCloseWrapper> component which is deprecated.
 * It's only used for class components that does not support using the useRootClose hook.
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import useRootClose from 'react-overlays/useRootClose';

const RootCloseWrapper = forwardRef(({ children, onRootClose, disabled }, ref) => {
  useRootClose(ref, onRootClose, {
    disabled
  });

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
