import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * this is used for reading the given dash character as "no value set" by a screenreader
 */
function NoValue() {
  return (
    <FormattedMessage id="stripes-components.noValue.noValueSet">
      {ariaLabel => (
        <span
          /* eslint-disable-next-line jsx-a11y/aria-role */
          role="text"
          aria-label={ariaLabel}
          data-test-no-value
        >
          {'-'}
        </span>
      )}
    </FormattedMessage>
  );
}

export default NoValue;
