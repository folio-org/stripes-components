import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import Headline from '../../Headline';
import IconButton from '../../IconButton';
import css from '../Accordion.css';

class FilterAccordionHeader extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    contentId: PropTypes.string,
    onToggle: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    displayWhenOpen: PropTypes.element,
    displayWhenClosed: PropTypes.element,
    displayClearButton: PropTypes.bool,
    onClearFilter: PropTypes.func,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    displayClearButton: true,
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
    const { label, open, disabled, displayWhenOpen, displayWhenClosed, displayClearButton, onClearFilter, contentId } = this.props;
    const clearButtonVisible = displayClearButton && typeof onClearFilter === 'function';
    return (
      <div className={css.headerWrapper}>
        <Headline size="small" tag="h3" block={!clearButtonVisible}>
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
          >
            { disabled ? null : <Icon size="small" icon={`${open ? 'up' : 'down'}-caret`} /> }
            <div className={css.labelArea}>
              <div className={css.filterSetLabel} >{label}</div>
            </div>
          </button>
        </Headline>
        { clearButtonVisible ?
          <IconButton
            size="small"
            iconSize="small"
            icon="clearX"
            title={`Clear selected filters for "${label}"`}
            ariaLabel={`Clear selected filters for "${label}"`}
            onClick={this.handleClearButtonClick}
          /> : null
        }
        {open ? displayWhenOpen : displayWhenClosed}
      </div>
    );
  }
}

export default FilterAccordionHeader;
