import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '../Paneset';
import LoadingPane from './LoadingPane';

const LoadingView = ({ panesetProps, ...props }) => (
  <Paneset {...panesetProps}>
    <LoadingPane {...props} />
  </Paneset>
);

LoadingView.propTypes = {
  panesetProps: PropTypes.object,
};

export default LoadingView;
