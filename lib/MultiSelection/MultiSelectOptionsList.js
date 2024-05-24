import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';

import OptionsListWrapper from './OptionsListWrapper';


const getMenuStyle = (atSmallMedia, containerWidth) => {
  return atSmallMedia ?
    { width: `${containerWidth}px`} :
    { width: '100%'}
}

const getListStyle = (atSmallMedia, maxHeight) => {
  return atSmallMedia ?
    { maxHeight: '60vh' } :
    { maxHeight: `${maxHeight}px`}
};

const MultiSelectOptionsList = ({
  atSmallMedia,
  asyncFiltering,
  containerWidth,
  controlRef,
  id,
  isOpen,
  getMenuProps,
  labelId,
  maxHeight,
  emptyMessage,
  modifiers,
  error,
  warning,
  useLegacy,
  renderFilterInput,
  renderToOverlay,
  renderActions,
  renderOptions,
  renderLoading,
  renderedItems,
}) => {
    return (
      <OptionsListWrapper
        className={css.multiSelectMenu}
        style={getMenuStyle(atSmallMedia, containerWidth)}
        modifiers={modifiers}
        isOpen={isOpen}
        controlRef={controlRef}
        useLegacy={(useLegacy || atSmallMedia)}
        renderToOverlay={renderToOverlay}
      >
        {atSmallMedia && renderFilterInput()}
        <div role="alert" className={css.multiSelectFeedback}>
          {error && <div className={css.multiSelectError}>{error}</div>}
          {warning && <div className={css.multiSelectWarning}>{warning}</div>}
          {renderedItems && renderedItems?.length === 0 &&
                <div className={css.multiSelectEmptyMessage}>{emptyMessage}</div>
          }
          {asyncFiltering && !renderedItems &&
            renderLoading
          }
        </div>
        <ul
          style={getListStyle(atSmallMedia, maxHeight)}
          {...getMenuProps({ id })}
          aria-labelledby={labelId}
          className={css.multiSelectOptionList}
        >
          {renderOptions()}
          {renderActions()}
        </ul>
      </OptionsListWrapper>
    );
  }


MultiSelectOptionsList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    onSelect: PropTypes.func.isRequired,
  })),
  ariaLabelledBy: PropTypes.string,
  asyncFiltering: PropTypes.bool,
  atSmallMedia: PropTypes.bool,
  containerWidth: PropTypes.number,
  controlRef: PropTypes.object,
  downshiftActions: PropTypes.object,
  emptyMessage: PropTypes.node,
  error: PropTypes.node,
  exactMatch: PropTypes.bool,
  formatter: PropTypes.func,
  getInputProps: PropTypes.func,
  getItemProps: PropTypes.func,
  getMenuProps: PropTypes.func,
  highlightedIndex: PropTypes.number,
  id: PropTypes.string,
  inputKeyDown: PropTypes.func,
  inputRef: PropTypes.object,
  inputValue: PropTypes.string,
  internalChangeCallback: PropTypes.func,
  isOpen: PropTypes.bool,
  itemToString: PropTypes.func,
  maxHeight: PropTypes.number,
  modifiers: PropTypes.object,
  placeholder: PropTypes.string,
  removeItem: PropTypes.func,
  renderedItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  renderToOverlay: PropTypes.bool,
  selectedItems: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  setHighlightedIndex: PropTypes.func,
  useLegacy: PropTypes.bool,
  warning: PropTypes.node,
};

export default MultiSelectOptionsList;
