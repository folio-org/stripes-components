import React from 'react';
import PropTypes from 'prop-types';
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
  return (
    <div className={css.kvRoot}>
      <div className={css.kvLabel}>{props.label}</div>
      {props.children || (
        <div>{props.value}</div>
      )}
    </div>
  );
}

KeyValue.propTypes = propTypes;

export default KeyValue;
