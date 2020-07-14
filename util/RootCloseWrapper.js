import React, { useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import useRootClose from 'react-overlays/useRootClose';
import childrenOf from './childrenOf';

const RootCloseWrapper = forwardRef(({ children, onRootClose, disabled }, ref) => {
  useRootClose(ref, onRootClose, {
    disabled
  });

  return children;
});

RootCloseWrapper.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onRootClose: PropTypes.func,
};

RootCloseWrapper.defaultProps = {
  disabled: false,
};

export default RootCloseWrapper;
