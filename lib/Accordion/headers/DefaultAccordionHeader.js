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
  contentId: PropTypes.string,
  displayWhenOpen: PropTypes.element,
  displayWhenClosed: PropTypes.element,
  toggleRef: PropTypes.func,
  autoFocus: PropTypes.bool,
};

const DefaultAccordionHeader = (props) => {
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

  const { label, open, displayWhenOpen, displayWhenClosed, id } = props;
  
  // Content in the right side of the header
  let headerRight = null;
  const headerRightContent = open ? displayWhenOpen : displayWhenClosed;
  if (headerRightContent) {
    headerRight = <div className={css.headerDefaultContentRight}>{headerRightContent}</div>;
  }

  return (
    <div className={css.headerWrapper}>
      <div className={`${css.header} ${css.default}`}>
        <Headline size="medium" tag="h3" block>
          <button
            type="button"
            onClick={handleHeaderClick}
            onKeyPress={handleKeyPress}
            className={css.defaultCollapseButton}
            ref={props.toggleRef}
            autoFocus={props.autoFocus}
            aria-expanded={open}
            aria-controls={props.contentId}
            role="tab"
            id={`accordion-toggle-button-${props.id}`}
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

export default DefaultAccordionHeader;
