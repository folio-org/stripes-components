/*
* OptionSegment
* Component for building custon list options that take advantage of filter result highlighting.
*/

import React from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';
import css from './Selection.css';

const propTypes = {
  innerText: PropTypes.string,
  searchTerm: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
};

function render({ ...props }) {
  const { searchTerm, innerText, children } = props;
  if (searchTerm === '') {
    return (innerText || children);
  } else {
    return (
      <HighLight search={searchTerm} matchClass={css.optionMatchedSubstring}>{innerText || children}</HighLight>
    );
  }
}

const OptionSegment = ({ searchTerm, innerText, children }) => (
  <div className={css.optionSegment}>
    {render({ searchTerm, innerText, children })}
  </div>
);

OptionSegment.propTypes = propTypes;

export default OptionSegment;
