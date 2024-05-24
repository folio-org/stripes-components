import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';
import Popper from '../Popper';

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

const getPortal = (renderToOverlay) => renderToOverlay ? document.getElementById('OverlayContainer') : undefined;

const MultiSelectOptionsList = ({
  asyncFiltering,
  atSmallMedia,
  containerWidth,
  controlRef,
  emptyMessage,
  error,
  getMenuProps,
  id,
  isOpen,
  labelId,
  maxHeight,
  modifiers,
  renderActions,
  renderedItems,
  renderFilterInput,
  renderLoading,
  renderOptions,
  renderToOverlay,
  warning,
}) => {
  const control = (
    <>
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
    </>
  );
  if(atSmallMedia) {
    return (
      <div
        className={css.multiSelectMenu}
        style={getMenuStyle(atSmallMedia, containerWidth)}
      >
        { control}
      </div>
    )
  }
    return (
      <Popper
        anchorRef={controlRef}
        overlayProps={{
          className: css.multiSelectMenu,
          style: getMenuStyle(atSmallMedia, containerWidth)
        }}
        modifiers={modifiers}
        isOpen={isOpen}
        portal={getPortal(renderToOverlay)}
        placement="bottom-start"
        hideIfClosed
      >
       {control}
      </Popper>
    );
  };


MultiSelectOptionsList.propTypes = {
  asyncFiltering: PropTypes.bool,
  atSmallMedia: PropTypes.bool,
  containerWidth: PropTypes.number,
  controlRef: PropTypes.object,
  emptyMessage: PropTypes.node,
  error: PropTypes.node,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  maxHeight: PropTypes.number,
  modifiers: PropTypes.object,
  renderActions: PropTypes.func,
  renderedItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  renderFilterInput: PropTypes.func,
  renderLoading: PropTypes.node,
  renderOptions: PropTypes.func,
  renderToOverlay: PropTypes.bool,
  useLegacy: PropTypes.bool,
  warning: PropTypes.node,
};

export default MultiSelectOptionsList;
