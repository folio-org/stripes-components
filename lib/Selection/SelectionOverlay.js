import React, { useEffect, useRef } from "react";
import { useIntl } from 'react-intl';
import Portal from 'react-overlays/Portal';
import SelectionList from "./SelectionList";
import Popper from '../Popper';

import css from './Selection.css';

const SelectionOverlay = ({
  controlRef,
  dataOptions,
  id,
  isOpen,
  emptyMessage,
  filterValue,
  getInputProps,
  label,
  listMaxHeight,
  loading,
  loadingMessage,
  onChangeFilterValue,
  width,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const containerRef = useRef(null);
  const filterRef = useRef(null);
  useEffect(() => {
    // if the overlay is open and focus is outside of it, move focus to the filter.
    if (
      isOpen &&
      containerRef.current &&
      !containerRef.current.matches(":focus-within")
    ) {
      filterRef.current.focus();
    }

    // if overlay is closing and focus is within the overlay, move focus to the Selection control.
    if(!isOpen &&
      containerRef.current &&
      containerRef.current.matches(":focus-within")
    ) {
      onChangeFilterValue('');
      controlRef.current?.focus();
    }
  });

  const atSmallMedia = window.matchMedia('(max-width: 640px)').matches;

  const uiInput = (
    <div className={css.selectionFilterContainer}>
      <input
        type="text"
        {...getInputProps({
          ref: filterRef,
          value: filterValue,
        })}
        onClick={() => {}}
        onChange={(e) => onChangeFilterValue(e.target.value)}
        aria-label={formatMessage({ id: 'stripes-components.selection.filterOptionsLabel', values: { label } })}
        className={css.selectionFilter}
        placeholder={formatMessage({ id: 'stripes-components.selection.filterOptionsPlaceholder'})}
      />
    </div>
  );

  const selectList = (
    <SelectionList
      dataOptions={dataOptions}
      emptyMessage={emptyMessage}
      loading={loading}
      loadingMessage={loadingMessage}
      listMaxHeight={listMaxHeight}
      searchTerm={filterValue} {...props}/>
  );

  if (atSmallMedia) {
    return (
      <div ref={containerRef}>
        {isOpen &&
          <Portal container={document.getElementById('OverlayContainer')}>
            <div
              role="presentation"
              className={css.selectionMobileBackdrop}
              onClick={() => { controlRef.current?.focus()}}
            >
              <div
                className={css.selectionListRoot}
                style={{ width: '85vw' }}
                id={`sl-container-${id}`}
              >
                {uiInput}
                {selectList}
              </div>
            </div>
          </Portal>
        }
      </div>
    );
  }

  return (
    <Popper isOpen={isOpen}
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

export default SelectionOverlay;
