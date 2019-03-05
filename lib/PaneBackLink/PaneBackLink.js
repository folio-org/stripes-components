import React from 'react';
import PaneHeaderIconButton from '../PaneHeaderIconButton';
import css from './PaneBackLink.css';

export default function PaneBackLink(props) {
  return (
    <PaneHeaderIconButton
      className={css.paneBackLink}
      icon="arrow-left"
      {...props}
    />
  );
}
