import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import contains from 'dom-helpers/query/contains';
import Icon from '../../Icon';
import Button from '../../Button';
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
    if (contains(this.toggleElem, e.target) ||
      e.target === this.labelElem ||
      e.target === this.containerElem ||
      e.target === this.iconElem) {
      const { id, label } = this.props;
      this.props.onToggle({ id, label });

      e.stopPropagation();
    }
  }

  handleClearButtonClick = () => {
    this.props.onClearFilter(this.props.name);
  }

  handleKeyPress = (e) => {
    e.preventDefault();

    if (e.charCode === 13 || e.charCode === 32) { // enter key or space key...
      if (e.target === this.toggleElem || e.target === this.labelElem || e.target === this.containerElem) {
        const { id, label } = this.props;
        this.props.onToggle({ id, label });
      }
    }
  }

  render() {
    const { label, open, disabled, displayWhenOpen, displayWhenClosed, displayClearButton, onClearFilter, contentId } = this.props;
    const clearButtonVisible = displayClearButton && typeof onClearFilter === 'function';
    return (
      <div className={css.headerWrapper} ref={(ref) => { this.containerElem = ref; }} >
        <Headline size="small" tag="h3">
          <Button
            buttonStyle="link"
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
            buttonRef={(ref) => { this.toggleElem = ref; }}
            autoFocus={this.props.autoFocus}
          >
            { disabled ? null : <Icon size="small" icon={`${open ? 'up' : 'down'}-caret`} ref={(r) => { this.iconElem = r; }} /> }
            <div className={css.labelArea} ref={(ref) => { this.labelElem = ref; }}>
              <div className={css.filterSetLabel} >{label}</div>
            </div>
          </Button>
        </Headline>
        { clearButtonVisible ?
          <IconButton
            size="small"
            iconSize="small"
            icon="clearX"
            title={`Clear selected filters for "${label}"`}
            ariaLabel={`Clear selected filters for "${label}"`}
            onClick={this.handleClearButtonClick}
            className={css.clearIconButton}
          /> : null
        }
        {open ? displayWhenOpen : displayWhenClosed}
      </div>
    );
  }
}

export default FilterAccordionHeader;
