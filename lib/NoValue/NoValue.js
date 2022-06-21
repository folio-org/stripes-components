import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const propTypes = {
  ariaLabel: PropTypes.string,
};

/**
 * this is used for reading the given dash character as "no value set" by a screenreader
 */
function NoValue({ ariaLabel = null }) {
  return (
    <FormattedMessage id="stripes-components.noValue.noValueSet">
      {([message]) => (
        <span data-test-no-value>
          <span className="sr-only">
            {ariaLabel || message}
          </span>
          <span aria-hidden>
            {'-'}
          </span>
        </span>
      )}
    </FormattedMessage>
  );
}

NoValue.propTypes = propTypes;

export default NoValue;
