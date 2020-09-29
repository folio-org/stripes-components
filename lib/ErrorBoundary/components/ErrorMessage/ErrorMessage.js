/**
 * ErrorBoundary -> ErrorMessage
 */

import React from 'react';
import PropTypes from 'prop-types';
import MessageBanner from '../../../MessageBanner';
import Headline from '../../../Headline';
import css from './ErrorMessage.css';

const ErrorMessage = ({ error, stack }) => (
  <MessageBanner
    type="error"
    icon={null}
    className={css.message}
    contentClassName={css.message__content}
  >
    <Headline tag="h3" size="large" className={css.title}>
      Error: {error}
    </Headline>
    <pre className={css.stack}>
      {stack}
    </pre>
  </MessageBanner>
);

ErrorMessage.propTypes = {
  error: PropTypes.node,
  stack: PropTypes.node,
};

export default ErrorMessage;
