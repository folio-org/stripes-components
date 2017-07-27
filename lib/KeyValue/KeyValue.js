import React from 'react';
import PropTypes from 'prop-types';
import css from './KeyValue.css';

const propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

function KeyValue(props) {
  return (
    <div className={css.kvRoot}>
      <div className={css.kvLabel}>{props.label}</div>
      <div className={css.kvValue}>{props.value}</div>
    </div>
  );
}

KeyValue.propTypes = propTypes;

export default KeyValue;
