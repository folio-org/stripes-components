import React from 'react';
import PaneHeaderIconButton from '../PaneHeaderIconButton';
import css from './PaneCloseLink.css';

export default function PaneCloseLink(props) {
  return (
    <div className={css.paneCloseLink}>
      <PaneHeaderIconButton
        className={css.paneCloseLinkArrow}
        icon="arrow-left"
        {...props}
      />
      <PaneHeaderIconButton
        className={css.paneCloseLinkX}
        icon="times"
        {...props}
      />
    </div>
  );
}
