/*
* OptionSegment
* Component for building custon list options that take advantage of filter result highlighting.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from '../Highlighter';
import css from './Selection.css';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  innerText: PropTypes.string,
  searchTerm: PropTypes.string,
};

const OptionSegment = ({ searchTerm, innerText, children }) => {
  const text = innerText || children;
  let rendered;
  if (!searchTerm || searchTerm === '' || typeof text !== 'string') {
    rendered = text;
  } else {
    rendered = (
      <Highlighter
        searchWords={searchTerm.split(' ')}
        text={text}
      />
    );
  }

  return (
    <div
      data-test-selection-option-segment
      className={css.optionSegment}
    >
      {rendered}
    </div>
  )
};

OptionSegment.propTypes = propTypes;

export default OptionSegment;
