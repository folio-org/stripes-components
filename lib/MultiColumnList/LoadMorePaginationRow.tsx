// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";
import PagingButton from "./PagingButton";
import RowPositioner from "./RowPositioner";
import CenteredContainer from "./CenteredContainer";
type LoadMorePaginationRowProps = {
  dataEndReached?: boolean;
  handleLoadMore?: (...args: any[]) => any;
  id?: string;
  keyId?: string;
  loading?: boolean;
  pageAmount?: number;
  pagingButtonLabel?: React.ReactNode;
  pagingButtonRef?: Record<string, any>;
  positionCache?: Record<string, any>;
  prevWidth?: number;
  rowHeightCache?: Record<string, any>;
  rowIndex?: number;
  sendMessage?: (...args: any[]) => any;
  setFocusIndex?: (...args: any[]) => any;
  staticBody?: boolean;
  virtualize?: boolean;
  width?: number;
};

const LoadMorePaginationRow = ({
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  loading,
  pageAmount,
  pagingButtonLabel,
  pagingButtonRef,
  positionCache,
  prevWidth,
  rowHeightCache,
  rowIndex,
  sendMessage,
  setFocusIndex,
  staticBody,
  virtualize,
  width,
}: LoadMorePaginationRowProps) => {
  if (dataEndReached) {
    return null;
  }

  return (
    <RowPositioner
      key={`load-button-positioner-${rowIndex}-${keyId}`}
      gridId={id}
      heightCache={rowHeightCache}
      positionCache={positionCache}
      shouldPosition={!staticBody}
      rowIndex={rowIndex}
    >
      {({ localRowIndex, position }) => (
        <div
          key={`${localRowIndex}-load-button`}
          style={{
            position: virtualize ? "absolute" : "relative",
            top: `${position}px`,
            marginTop: "1rem",
          }}
        >
          <CenteredContainer
            width={width || prevWidth || undefined}
            innerRef={pagingButtonRef}
            visible
          >
            <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
              {([message]) => (
                <PagingButton
                  onClick={() => {
                    setFocusIndex(rowIndex);
                    handleLoadMore(pageAmount, rowIndex);
                  }}
                  sendMessage={sendMessage}
                  loadingMessage={message}
                  disabled={loading}
                  pagingButtonLabel={pagingButtonLabel}
                  id={`${id || keyId}-clickable-paging-button`}
                  style={{ width: "75%" }}
                />
              )}
            </FormattedMessage>
          </CenteredContainer>
        </div>
      )}
    </RowPositioner>
  );
};

export default LoadMorePaginationRow;
