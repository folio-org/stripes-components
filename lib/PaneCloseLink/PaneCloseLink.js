import React from 'react';
import IconButton from '../IconButton';
import css from './PaneCloseLink.css';

export default function PaneCloseLink(props) {
  return (
    <div className={css.paneCloseLink}>
      <IconButton
        className={css.paneCloseLinkArrow}
        icon="arrow-left"
        {...props}
      />
      <IconButton
        className={css.paneCloseLinkX}
        icon="times"
        {...props}
      />
    </div>
  );
}
