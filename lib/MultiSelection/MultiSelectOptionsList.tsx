// @ts-nocheck
import React from "react";
import css from "./MultiSelect.css";
import Popper from "../Popper";
import Icon from "../Icon";
type MultiSelectOptionsListProps = {
  asyncFiltering?: boolean;
  atSmallMedia?: boolean;
  containerWidth?: number;
  controlRef?: Record<string, any>;
  emptyMessage?: React.ReactNode;
  error?: React.ReactNode;
  getMenuProps?: (...args: any[]) => any;
  id?: string;
  isOpen?: boolean;
  labelId?: string;
  maxHeight?: number;
  modifiers?: Record<string, any>;
  renderActions?: (...args: any[]) => any;
  renderedItems?: string[] | Record<string, any>[];
  renderFilterInput?: (...args: any[]) => any;
  renderOptions?: (...args: any[]) => any;
  renderToOverlay?: boolean;
  useLegacy?: boolean;
  usePortal?: boolean;
  warning?: React.ReactNode;
};

const getMenuStyle = (atSmallMedia, containerWidth) => {
  return atSmallMedia ? { width: "100%" } : { width: `${containerWidth}px` };
};

const getListStyle = (atSmallMedia, maxHeight) => {
  return atSmallMedia ? { maxHeight: "60vh" } : { maxHeight: `${maxHeight}px` };
};

const getPortal = (renderToOverlay, usePortal) => {
  return renderToOverlay || usePortal
    ? document.getElementById("OverlayContainer")
    : undefined;
};

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
}: MultiSelectOptionsListProps) => {
  const control = (
    <>
      {atSmallMedia && renderFilterInput()}
      <div role="alert" className={css.multiSelectFeedback}>
        {error && <div className={css.multiSelectError}>{error}</div>}
        {warning && <div className={css.multiSelectWarning}>{warning}</div>}
        {renderedItems && renderedItems?.length === 0 && (
          <div className={css.multiSelectEmptyMessage}>{emptyMessage}</div>
        )}
        {asyncFiltering && renderedItems.length === 0 && (
          <Icon icon="spinner-ellipsis" />
        )}
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
        {control}
      </div>
    );
  }
  return (
    <Popper
      anchorRef={controlRef}
      overlayProps={{
        className: css.multiSelectMenu,
        style: getMenuStyle(atSmallMedia, containerWidth),
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

export default MultiSelectOptionsList;
