import React from 'react';
import PropTypes from 'prop-types';
import Headline from '../../Headline';
import Icon from '../../Icon';
import css from '../Accordion.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  contentId: PropTypes.string,
  displayWhenClosed: PropTypes.element,
  displayWhenOpen: PropTypes.element,
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  toggleRef: PropTypes.func,
};

const defaultProps = {
  headingLevel: 3
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
        <Headline size="medium" tag={`h${props.headingLevel}`} block>
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
            id={`accordion-toggle-button-${id}`}
          >
            <span className={css.headerInner}>
              <span className={css.defaultHeaderIcon}>
                <Icon
                  size="small"
                  icon={props.open ? 'caret-up' : 'caret-down'}
                />
              </span>
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
DefaultAccordionHeader.defaultProps = defaultProps;

export default DefaultAccordionHeader;
