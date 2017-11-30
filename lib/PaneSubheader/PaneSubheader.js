import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneSubheader.css';

const PaneSubheader = ( {children} ) => (
  <div className={css.subheader}>
    {children}
  </div>
);

export default PaneSubheader;
