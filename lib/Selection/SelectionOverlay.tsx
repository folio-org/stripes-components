// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import SelectionList from "./SelectionList";
import Popper, { OVERLAY_MODIFIERS } from "../Popper";
import { OVERLAY_CONTAINER_ID } from "../../util/consts";

import css from "./Selection.css";
type SelectionOverlayProps = {
  controlRef?: ((...args: any[]) => any) | Record<string, any>;
  emptyMessage?: React.ReactNode;
  getMenuProps?: (...args: any[]) => any;
  id?: string;
  isOpen?: boolean;
  listContainerRef?: Record<string, any>;
  listMaxHeight?: string;
  onChangeFilterValue?: (...args: any[]) => any;
  optionAlignment?: string;
  popper?: Record<string, any>;
  renderFilterInput?: (...args: any[]) => any;
  renderOptions?: (...args: any[]) => any;
  usePortal?: boolean;
  width?: number;
};

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
}: SelectionOverlayProps) => {
  const filterRef = useRef(null);
  const getPortalElement = useRef(() =>
    document.getElementById(OVERLAY_CONTAINER_ID),
  ).current;

  useEffect(() => {
    // if the overlay is open and focus is outside of it, move focus to the filter.
    if (isOpen && listContainerRef.current?.matches(":not(:focus-within)")) {
      filterRef.current?.focus();
    }

    // if overlay is closing and focus is within the overlay, move focus to the Selection control.
    if (!isOpen && listContainerRef.current?.matches(":focus-within")) {
      onChangeFilterValue("");
      controlRef.current?.focus();
    }
  }, [isOpen, onChangeFilterValue, controlRef, listContainerRef]);

  const atSmallMedia = window.matchMedia("(max-width: 640px)").matches;

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
    const portalContent = (
      <div
        role="presentation"
        className={css.selectionMobileBackdrop}
        onClick={() => {
          controlRef.current?.focus();
        }}
      >
        <div
          className={css.selectionListRoot}
          style={{ width: "85vw" }}
          id={`sl-container-${id}`}
          ref={listContainerRef}
        >
          {renderFilterInput(filterRef)}
          {isOpen && selectList}
        </div>
      </div>
    );

    return (
      <div>{isOpen && createPortal(portalContent, getPortalElement())}</div>
    );
  }

  const popperProps = {
    portal: isOpen && usePortal ? getPortalElement() : undefined,
    modifiers: OVERLAY_MODIFIERS,
    ...popper,
  };
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

export default SelectionOverlay;
