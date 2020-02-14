import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';

import css from './KeyValue.css';

const propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  subValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function KeyValue({ children, label, value, subValue, ...rest }) {
  // pull any data-test-* props into a spreadable object
  const dataProps = pickBy(rest, (_, key) => /^data-test/.test(key));

  return (
    <div className={css.kvRoot} {...dataProps}>
      <div className={css.kvLabel}>
        {label}
      </div>
      <div
        className={css.kvValue}
        data-test-kv-value
      >
        {children || value}
      </div>
      {subValue && (
        <em
          data-test-kv-sub-value
          className={css.kvSub}
        >
          {subValue}
        </em>
      )}
    </div>
  );
}

KeyValue.propTypes = propTypes;

export default KeyValue;
