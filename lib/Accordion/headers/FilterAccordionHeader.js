import { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import Headline from '../../Headline';
import IconButton from '../../IconButton';
import css from '../Accordion.css';

const FilterAccordionHeader = forwardRef(({
  autoFocus,
  contentId,
  disabled,
  displayWhenOpen,
  displayWhenClosed,
  displayClearButton = true,
  headingLevel = 3,
  headerProps,
  id,
  label,
  labelId,
  name,
  onClearFilter,
  onToggle,
  open,
  toggleRef: toggleRefProp,
}, ref) => {
  const { formatMessage } = useIntl();
  const toggleRef = useRef(null);
  useImperativeHandle(toggleRefProp, () => toggleRef.current);

  const handleHeaderClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle({ id, label });
  }, [id, label, onToggle]);

  const handleClearButtonClick = useCallback(() => {
    toggleRef.current?.focus();
    onClearFilter(name);
  }, [onClearFilter, name, toggleRef]);

  const handleKeyPress = useCallback((e) => {
    e.preventDefault();
    if (e.charCode === 13) { // 13 = enter
      onToggle({ id, label });
    }
  }, [id, label, onToggle]);

  const clearButtonVisible = displayClearButton && typeof onClearFilter === 'function';
  const labelPropsId = label?.props?.id;
  const labelText = labelPropsId ? formatMessage({ id: labelPropsId }) : label || '-';
  const clearFilterSetLabel = formatMessage(
    { id: 'stripes-components.filterGroups.clearFilterSetLabel' },
    { labelText }
  );

  return (
    <div className={css.headerWrapper} ref={ref}>
      <Headline size="small" tag={`h${headingLevel}`} block={!clearButtonVisible}>
        <button
          type="button"
          tabIndex="0"
          onClick={handleHeaderClick}
          onKeyPress={handleKeyPress}
          aria-label={`${labelText} filter list`}
          aria-controls={contentId}
          aria-expanded={open}
          disabled={disabled}
          className={classNames(css.filterSetHeader, { [css.clearButtonVisible]: clearButtonVisible })}
          autoFocus={autoFocus}
          ref={toggleRef}
          id={labelId}
          {...headerProps}
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
          aria-label={clearFilterSetLabel}
          onClick={handleClearButtonClick}
        /> : null
      }
      {open ? displayWhenOpen : displayWhenClosed}
    </div>
  );
});

FilterAccordionHeader.propTypes = {
  autoFocus: PropTypes.bool,
  contentId: PropTypes.string,
  disabled: PropTypes.bool,
  displayClearButton: PropTypes.bool,
  displayWhenClosed: PropTypes.element,
  displayWhenOpen: PropTypes.element,
  headerProps: PropTypes.object,
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  id: PropTypes.string,
  intl: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string,
  onClearFilter: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  toggleRef: PropTypes.func,
};

export default FilterAccordionHeader;
