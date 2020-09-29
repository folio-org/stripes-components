/**
 * ErrorBoundary -> ErrorMessage
 */

import React from 'react';
import PropTypes from 'prop-types';
import MessageBanner from '../../../MessageBanner';
import Headline from '../../../Headline';
import css from './ErrorMessage.css';

const ErrorMessage = ({ error, stack, id }) => (
  <MessageBanner
    type="error"
    icon={null}
    className={css.message}
    contentClassName={css.message__content}
    id={id}
    data-test-error-boundary-message
  >
    <Headline
      tag="h3"
      size="large"
      className={css.error}
      data-test-error-boundary-message-error
    >
      Error: {error}
    </Headline>
    <pre className={css.stack} data-test-error-boundary-message-stack-trace>
      {stack}
    </pre>
  </MessageBanner>
);

ErrorMessage.propTypes = {
  error: PropTypes.node,
  id: PropTypes.string,
  stack: PropTypes.node,
};

export default ErrorMessage;
