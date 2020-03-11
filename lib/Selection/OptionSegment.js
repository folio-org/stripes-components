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

const render = ({ ...props }) => {
  const { searchTerm, innerText, children } = props; /* eslint-disable-line react/prop-types */
  const text = innerText || children;

  if (!searchTerm || searchTerm === '' || typeof text !== 'string') {
    return text;
  }

  return (
    <Highlighter
      searchWords={searchTerm.split(' ')} // eslint-disable-line react/prop-types
      text={text}
    />
  );
};

const OptionSegment = ({ searchTerm, innerText, children }) => (
  <div className={css.optionSegment}>
    {render({ searchTerm, innerText, children })}
  </div>
);

OptionSegment.propTypes = propTypes;

export default OptionSegment;
