import React from 'react';
import PropTypes from 'prop-types';
import css from './MultiSelect.css';
import Popper from '../Popper';
import Icon from '../Icon';

const getMenuStyle = (atSmallMedia, containerWidth) => {
  return atSmallMedia ?
    { width: '100%' } :
    { width: `${containerWidth}px` }
}

const getListStyle = (atSmallMedia, maxHeight) => {
  return atSmallMedia ?
    { maxHeight: '60vh' } :
    { maxHeight: `${maxHeight}px` }
};

const getPortal = (renderToOverlay, usePortal) => {
  return (renderToOverlay || usePortal) ? document.getElementById('OverlayContainer') : undefined;
}

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
  renderOptions,
  renderToOverlay = false,
  usePortal,
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
        {asyncFiltering && renderedItems.length === 0 && (<Icon icon="spinner-ellipsis" />)}
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
  if (atSmallMedia) {
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
      portal={getPortal(renderToOverlay, usePortal)}
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
  getMenuProps: PropTypes.func,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  labelId: PropTypes.string,
  maxHeight: PropTypes.number,
  modifiers: PropTypes.object,
  renderActions: PropTypes.func,
  renderedItems: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object)
  ]),
  renderFilterInput: PropTypes.func,
  renderOptions: PropTypes.func,
  renderToOverlay: PropTypes.bool,
  useLegacy: PropTypes.bool,
  usePortal: PropTypes.bool,
  warning: PropTypes.node,
};

export default MultiSelectOptionsList;
