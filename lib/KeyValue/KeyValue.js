import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';

import css from './KeyValue.css';

const propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  sub: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function KeyValue({ children, label, value, sub, ...rest }) {
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
      {sub && (
        <em
          data-test-kv-sub
          className={css.kvSub}
        >
          {sub}
        </em>
      )}
    </div>
  );
}

KeyValue.propTypes = propTypes;

export default KeyValue;
