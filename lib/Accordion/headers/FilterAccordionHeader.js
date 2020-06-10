import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import Headline from '../../Headline';
import IconButton from '../../IconButton';
import css from '../Accordion.css';

class FilterAccordionHeader extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    contentId: PropTypes.string,
    disabled: PropTypes.bool,
    displayClearButton: PropTypes.bool,
    displayWhenClosed: PropTypes.element,
    displayWhenOpen: PropTypes.element,
    headerElement: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    name: PropTypes.string,
    onClearFilter: PropTypes.func,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    toggleRef: PropTypes.func,
  };

  static defaultProps = {
    displayClearButton: true,
    headerElement: 'h3'
  };

  handleHeaderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { id, label } = this.props;
    this.props.onToggle({ id, label });
  }

  handleClearButtonClick = () => {
    this.props.onClearFilter(this.props.name);
  }

  handleKeyPress = (e) => {
    e.preventDefault();
    if (e.charCode === 13) { // 13 = enter
      const { id, label } = this.props;
      this.props.onToggle({ id, label });
    }
  }

  render() {
    const {
      label,
      open,
      disabled,
      displayWhenOpen,
      displayWhenClosed,
      displayClearButton,
      onClearFilter,
      contentId,
      headerElement,
    } = this.props;
    const clearButtonVisible = displayClearButton && typeof onClearFilter === 'function';
    return (
      <div className={css.headerWrapper}>
        <Headline size="small" tag={headerElement} block={!clearButtonVisible}>
          <button
            type="button"
            tabIndex="0"
            onClick={this.handleHeaderClick}
            onKeyPress={this.handleKeyPress}
            aria-label={`${label} filter list`}
            aria-controls={contentId}
            aria-expanded={open}
            disabled={disabled}
            className={classNames(css.filterSetHeader, { [css.clearButtonVisible]: clearButtonVisible })}
            role="tab"
            autoFocus={this.props.autoFocus}
            ref={this.props.toggleRef}
            id={`accordion-toggle-button-${this.props.id}`}
          >
            {
              disabled ? null :
              <Icon
                iconClassName={css.filterSetHeaderIcon}
                size="small"
                icon={`caret-${open ? 'up' : 'down'}`}
              />
            }
            <div className={css.labelArea}>
              <div className={css.filterSetLabel}>{label}</div>
            </div>
          </button>
        </Headline>
        { clearButtonVisible ?
          <IconButton
            data-test-clear-button
            size="small"
            iconSize="small"
            icon="times-circle-solid"
            aria-label={`Clear selected filters for "${label}"`}
            onClick={this.handleClearButtonClick}
          /> : null
        }
        {open ? displayWhenOpen : displayWhenClosed}
      </div>
    );
  }
}

export default FilterAccordionHeader;
