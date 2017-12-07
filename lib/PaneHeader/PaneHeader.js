import React from 'react';
import PropTypes from 'prop-types';
import css from './PaneHeader.css';
import menuCss from '../PaneMenu/PaneMenu.css';
import Icon from '../Icon';
import { PaneMenuIcon } from '../PaneMenu';

const propTypes = {
  firstMenu: PropTypes.element,
  lastMenu: PropTypes.element,
  paneTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClose: PropTypes.func,
  dismissible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

const PaneHeader = (props) => {
  const {
    paneTitle,
    header,
    dismissible,
    firstMenu,
    lastMenu,
    onClose,
  } = props;

  let headerContent;
  let title;
  let displayedFirstMenu;
  let displayedLastMenu;
  let closeAction;

  if (props.header) {
    headerContent = <div className={css.paneHeader}>{header}</div>;
  } else {
    if (typeof (props.paneTitle) === 'string') {
      title = <div className={css.paneTitle}>{paneTitle}</div>;
    } else {
      title = paneTitle || <div>&nbsp;</div>;
    }

    if (dismissible) { // assemble close button...
      let description = 'pane';
      if (typeof (paneTitle) === 'string') {
        description = paneTitle;
      }
      closeAction = (
        <PaneMenuIcon
          icon="closeX"
          onClick={onClose}
          title="Close pane"
          ariaLabel={`Close ${description}`}
        />
      );
    }

    if (firstMenu) { // inject close button into first menu...
      if (dismissible !== 'last') {
        const firstMenuChildren =
          [closeAction].concat(React.Children.toArray(firstMenu.props.children));
        displayedFirstMenu =
          React.cloneElement(
            firstMenu,
            {},
            firstMenuChildren,
          );
      } else {
        displayedFirstMenu = React.cloneElement(firstMenu);
      }
    } else {
      displayedFirstMenu = (
        <div className={menuCss.paneMenu}>
          {dismissible !== 'last' && closeAction}
          &nbsp;
        </div>
      );
    }

    if (lastMenu) { // inject close button into last menu if requested.
      if (dismissible === 'last') {
        const lastMenuChildren =
          React.Children.toArray(lastMenu.props.children).concat([closeAction]);

        displayedLastMenu = React.cloneElement(lastMenu, {}, lastMenuChildren);
      } else {
        displayedLastMenu = React.cloneElement(lastMenu);
      }
    } else {
      displayedLastMenu = (
        <div className={menuCss.paneMenu}>
          &nbsp;
          {dismissible === 'last' && closeAction}
        </div>
      );
    }

    headerContent = (
      <div className={css.paneHeader}>
        {displayedFirstMenu}
        {title}
        {displayedLastMenu}
      </div>
    );
  }

  return headerContent;
};

PaneHeader.propTypes = propTypes;

export default PaneHeader;
