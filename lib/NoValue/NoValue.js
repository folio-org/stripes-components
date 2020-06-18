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
      {message => (
        <span
          aria-label={ariaLabel || message}
          data-test-no-value
        >
          {'-'}
        </span>
      )}
    </FormattedMessage>
  );
}

NoValue.propTypes = propTypes;

export default NoValue;
