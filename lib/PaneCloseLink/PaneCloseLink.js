import React from 'react';
import classnames from 'classnames';
import PaneHeaderIconButton from '../PaneHeaderIconButton';
import css from './PaneCloseLink.css';
import paneHeaderCss from '../PaneHeader/PaneHeader.css';

export default function PaneCloseLink(props) {
  return (
    <div className={classnames(css.paneCloseLink, paneHeaderCss.paneHeaderIconButton)}>
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
