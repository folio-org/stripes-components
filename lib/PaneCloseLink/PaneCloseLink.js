import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import PaneHeaderIconButton from '../PaneHeaderIconButton';

import css from './PaneCloseLink.css';
import paneHeaderCss from '../PaneHeader/PaneHeader.css';

const PaneCloseLink = (props) => {
  const {
    closeButtonRef,
    ...rest
  } = props;

  return (
    <div className={classnames(css.paneCloseLink, paneHeaderCss.paneHeaderIconButton)}>
      <PaneHeaderIconButton
        className={css.paneCloseLinkArrow}
        icon="arrow-left"
        {...rest}
      />
      <PaneHeaderIconButton
        className={css.paneCloseLinkX}
        icon="times"
        ref={closeButtonRef}
        {...rest}
      />
    </div>
  );
}

PaneCloseLink.propTypes = {
  closeButtonRef: PropTypes.object,
};

export default PaneCloseLink;
