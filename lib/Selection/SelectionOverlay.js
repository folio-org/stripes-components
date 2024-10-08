import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-overlays/Portal';
import SelectionList from './SelectionList';
import Popper, { OVERLAY_MODIFIERS } from '../Popper';

import css from './Selection.css';

const SelectionOverlay = ({
  controlRef,
  listContainerRef,
  getMenuProps,
  id,
  isOpen,
  listMaxHeight,
  onChangeFilterValue,
  optionAlignment,
  popper,
  renderFilterInput,
  renderOptions,
  usePortal,
  width,
  ...props
}) => {
  // const containerRef = useRef(null);
  const filterRef = useRef(null);
  const getPortalElement = useRef(() => document.getElementById('OverlayContainer')).current;

  useEffect(() => {
    // if the overlay is open and focus is outside of it, move focus to the filter.
    if (
      isOpen &&
      listContainerRef.current?.matches(':not(:focus-within)')
    ) {
      filterRef.current?.focus();
    }

    // if overlay is closing and focus is within the overlay, move focus to the Selection control.
    if (!isOpen &&
      listContainerRef.current?.matches(':focus-within')
    ) {
      onChangeFilterValue('');
      controlRef.current?.focus();
    }
  }, [isOpen, onChangeFilterValue, controlRef, listContainerRef]);

  const atSmallMedia = window.matchMedia('(max-width: 640px)').matches;

  const selectList = (
    <SelectionList
      renderOptions={renderOptions}
      listMaxHeight={listMaxHeight}
      optionAlignment={optionAlignment}
      getMenuProps={getMenuProps}
      isOpen={isOpen}
      {...props}
    />
  );

  if (atSmallMedia) {
    return (
      <div>
        {isOpen &&
          <Portal container={getPortalElement()}>
            <div
              role="presentation"
              className={css.selectionMobileBackdrop}
              onClick={() => { controlRef.current?.focus() }}
            >
              <div
                className={css.selectionListRoot}
                style={{ width: '85vw' }}
                id={`sl-container-${id}`}
                ref={listContainerRef}
              >
                {renderFilterInput(filterRef)}
                {isOpen && selectList}
              </div>
            </div>
          </Portal>
        }
      </div>
    );
  }

  const popperProps = {
    portal: (isOpen && usePortal) ? getPortalElement() : undefined,
    modifiers: OVERLAY_MODIFIERS,
    ...popper
  }
  return (
    <Popper
      isOpen={isOpen}
      anchorRef={controlRef}
      hideIfClosed
      {...popperProps}
    >
      <div
        className={css.selectionListRoot}
        style={{ width }}
        id={`sl-container-${id}`}
        ref={listContainerRef}
      >
        {renderFilterInput(filterRef)}
        {selectList}
      </div>
    </Popper>
  );
};

SelectionOverlay.propTypes = {
  controlRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  emptyMessage: PropTypes.node,
  getMenuProps: PropTypes.func,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  listContainerRef: PropTypes.object,
  listMaxHeight: PropTypes.string,
  onChangeFilterValue: PropTypes.func,
  optionAlignment: PropTypes.string,
  popper: PropTypes.object,
  renderFilterInput: PropTypes.func,
  renderOptions: PropTypes.func,
  usePortal: PropTypes.bool,
  width: PropTypes.number,
}

export default SelectionOverlay;
