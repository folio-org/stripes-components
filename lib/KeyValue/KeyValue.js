import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';

import css from './KeyValue.css';

const propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function KeyValue(props) {
  // pull any data-test-* props into a spreadable object
  const dataProps = pickBy(props, (_, key) => /^data-test/.test(key));

  return (
    <div className={css.kvRoot} {...dataProps}>
      <div className={css.kvLabel}>
        {props.label}
      </div>
      <div
        className={css.kvValue}
        data-test-kv-value
      >
        {props.children || props.value}
      </div>
    </div>
  );
}

KeyValue.propTypes = propTypes;

export default KeyValue;
