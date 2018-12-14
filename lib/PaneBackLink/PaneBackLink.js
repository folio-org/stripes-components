import React from 'react';
import IconButton from '../IconButton';
import css from './PaneBackLink.css';

export default function PaneBackLink(props) {
  return (
    <IconButton
      className={css.paneBackLink}
      icon="arrow-left"
      {...props}
    />
  );
}
