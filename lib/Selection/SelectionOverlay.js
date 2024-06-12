import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-overlays/Portal';
import SelectionList from './SelectionList';
import Popper from '../Popper';

import css from './Selection.css';

const SelectionOverlay = ({
  controlRef,
  getMenuProps,
  id,
  isOpen,
  listMaxHeight,
  onChangeFilterValue,
  optionAlignment,
  renderFilterInput,
  renderOptions,
  width,
  ...props
}) => {
  const containerRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    // if the overlay is open and focus is outside of it, move focus to the filter.
    if (
      isOpen &&
      containerRef.current?.matches(':not(:focus-within)')
    ) {
      filterRef.current?.focus();
    }

    // if overlay is closing and focus is within the overlay, move focus to the Selection control.
    if (!isOpen &&
      containerRef.current?.matches(':focus-within')
    ) {
      onChangeFilterValue('');
      controlRef.current?.focus();
    }
  }, [isOpen, onChangeFilterValue, controlRef]);

  const atSmallMedia = window.matchMedia('(max-width: 640px)').matches;

  const uiInput = renderFilterInput(filterRef);

  const selectList = (
    <SelectionList
      renderOptions={renderOptions}
      listMaxHeight={listMaxHeight}
      optionAlignment={optionAlignment}
      getMenuProps={getMenuProps}
      {...props}
    />
  );

  if (atSmallMedia) {
    return (
      <div ref={containerRef}>
        {isOpen &&
          <Portal container={document.getElementById('OverlayContainer')}>
            <div
              role="presentation"
              className={css.selectionMobileBackdrop}
              onClick={() => { controlRef.current?.focus() }}
            >
              <div
                className={css.selectionListRoot}
                style={{ width: '85vw' }}
                id={`sl-container-${id}`}
              >
                {renderFilterInput(filterRef)}
                {selectList}
              </div>
            </div>
          </Portal>
        }
      </div>
    );
  }

  return (
    <Popper
      isOpen={isOpen}
      anchorRef={controlRef}
      hideIfClosed
    >
      <div
        className={css.selectionListRoot}
        style={{ width }}
        id={`sl-container-${id}`}
        ref={containerRef}
      >
        {uiInput}
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
  listMaxHeight: PropTypes.string,
  onChangeFilterValue: PropTypes.func,
  optionAlignment: PropTypes.string,
  renderFilterInput: PropTypes.func,
  renderOptions: PropTypes.func,
  width: PropTypes.number,
}

export default SelectionOverlay;
