import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';

import css from './PaneFooter.css';

const PaneFooter = ({ children }) => (
  <div className={css.paneFooter}>
    <div className={css.paneFooterButtons}>
      {children}
    </div>
  </div>
);

PaneFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(Button),
    PropTypes.objectOf(Button),
  ]),
};

export default PaneFooter;
