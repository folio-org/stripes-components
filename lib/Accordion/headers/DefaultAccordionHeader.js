import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Headline from '../../Headline';
import Icon from '../../Icon';
import css from '../Accordion.css';

const propTypes = {
  onToggle: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  open: PropTypes.bool,
  id: PropTypes.string,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
  autoFocus: PropTypes.bool,
};
const contextTypes = {
  intl: intlShape,
};

const DefaultAccordionHeader = (props, context) => {
  function handleHeaderClick(e) {
    const { id, label } = props;
    props.onToggle({ id, label });
    e.stopPropagation();
  }

  function handleKeyPress(e) {
    e.preventDefault();
    if (e.charCode === 13) { // enter key
      const { id, label } = props;
      props.onToggle({ id, label });
    }
  }

  const { label, open, displayWhenOpen, displayWhenClosed } = props;

  // Content in the right side of the header
  let headerRight = null;
  const headerRightContent = open ? displayWhenOpen : displayWhenClosed;
  if (headerRightContent) {
    headerRight = <div className={css.headerDefaultContentRight}>{headerRightContent}</div>;
  }
  const collapseMsg = context.intl.formatMessage({ id: 'stripes-components.collapseSection' });
  const expandMsg = context.intl.formatMessage({ id: 'stripes-components.expandSection' });

  return (
    <div className={css.headerWrapper}>
      <div className={`${css.header} ${css.default}`}>
        <Headline size="medium" tag="h3" block>
          <button
            aria-label={open ? collapseMsg : expandMsg}
            type="button"
            onClick={handleHeaderClick}
            onKeyPress={handleKeyPress}
            className={css.defaultCollapseButton}
            autoFocus={props.autoFocus}
          >
            <span className={css.headerInner}>
              <Icon size="medium" icon={props.open ? 'up-caret' : 'down-caret'} />
              <div className={css.labelArea}>
                {label}
              </div>
            </span>
          </button>
        </Headline>
      </div>
      { headerRight }
    </div>
  );
};

DefaultAccordionHeader.propTypes = propTypes;
DefaultAccordionHeader.contextTypes = contextTypes;

export default DefaultAccordionHeader;
