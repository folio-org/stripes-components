// @ts-nocheck
/**
 * ErrorBoundary -> ErrorMessage
 */

import React from "react";
import MessageBanner from "../../../MessageBanner";
import Headline from "../../../Headline";
import css from "./ErrorMessage.css";
type ErrorMessageProps = {
  error?: React.ReactNode;
  id?: string;
  stack?: React.ReactNode;
};

const ErrorMessage = ({ error, stack, id }: ErrorMessageProps) => (
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

export default ErrorMessage;
