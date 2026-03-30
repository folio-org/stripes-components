// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";
type NoValueProps = { ariaLabel?: string };

/**
 * this is used for reading the given dash character as "no value set" by a screenreader
 */
function NoValue({ ariaLabel = null }: NoValueProps) {
  return (
    <FormattedMessage id="stripes-components.noValue.noValueSet">
      {([message]) => (
        <span data-test-no-value>
          <span className="sr-only">{ariaLabel || message}</span>
          <span aria-hidden>{"-"}</span>
        </span>
      )}
    </FormattedMessage>
  );
}

export default NoValue;
