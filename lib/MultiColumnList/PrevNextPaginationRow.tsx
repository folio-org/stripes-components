// @ts-nocheck
import React from "react";
import { useIntl } from "react-intl";
import Icon from "../Icon";
import PagingButton from "./PagingButton";
import css from "./MCLRenderer.css";
type PrevNextPaginationRowProps = {
  activeNext?: boolean;
  activePrevious?: boolean;
  containerRef?: ((...args: any[]) => any) | Record<string, any>;
  dataEndIndex?: number;
  dataEndReached?: boolean;
  dataStartIndex?: number;
  handleLoadMore?: (...args: any[]) => any;
  hidePageIndices?: boolean;
  id?: string;
  keyId?: string;
  loading?: boolean;
  loadingNext?: boolean;
  loadingPrevious?: boolean;
  pageAmount?: number;
  pagingOffset?: number;
  rowIndex?: number;
  sendMessage?: (...args: any[]) => any;
  setFocusIndex?: (...args: any[]) => any;
};

const PrevNextPaginationRow = ({
  activeNext,
  activePrevious,
  containerRef,
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  loading,
  loadingNext,
  loadingPrevious,
  pageAmount,
  pagingOffset,
  rowIndex,
  sendMessage,
  dataStartIndex,
  dataEndIndex,
  hidePageIndices,
  setFocusIndex,
}: PrevNextPaginationRowProps) => {
  const { formatMessage } = useIntl();
  if (dataEndReached) {
    return null;
  }

  const isNextButtonDisabled = loading || loadingNext || !activeNext;
  const isPrevButtonDisabled = loading || loadingPrevious || !activePrevious;

  const previousLabel = (
    <div data-test-pagination-previous>
      <Icon size="small" icon="caret-left">
        <span>{formatMessage({ id: "stripes-components.previous" })}</span>
      </Icon>
    </div>
  );

  const nextLabel = (
    <div data-test-pagination-next>
      <Icon size="small" icon="caret-right" iconPosition="end">
        <span>{formatMessage({ id: "stripes-components.next" })}</span>
      </Icon>
    </div>
  );

  const message = formatMessage({
    id: "stripes-components.mcl.itemsRequestedMessage",
  });

  return (
    <div style={{ padding: "8px 0" }} ref={containerRef}>
      <div className={css.mclPaginationCenterContainer}>
        <PagingButton
          onClick={() => {
            if (typeof pagingOffset !== "undefined") {
              setFocusIndex(0);
              handleLoadMore(pageAmount, pagingOffset - pageAmount, "prev");
            } else {
              const remainder = rowIndex % pageAmount;

              const rowIndexForPrevButton =
                remainder === 0
                  ? rowIndex - pageAmount * 2
                  : rowIndex - (pageAmount + remainder);

              setFocusIndex(rowIndexForPrevButton);
              handleLoadMore(pageAmount, rowIndexForPrevButton, "prev");
            }
          }}
          sendMessage={sendMessage}
          loading={loadingPrevious}
          loadingMessage={message}
          disabled={isPrevButtonDisabled}
          pagingButtonLabel={previousLabel}
          buttonStyle="none"
          bottomMargin0
          data-test-prev-paging-button
          id={`${id || keyId}-prev-paging-button`}
        />

        {!hidePageIndices && (
          <div className={css.mclPrevNextPageInfoContainer}>
            <div>{dataStartIndex}</div>&nbsp;-&nbsp;<div>{dataEndIndex}</div>
          </div>
        )}
        <PagingButton
          onClick={() => {
            if (typeof pagingOffset !== "undefined") {
              setFocusIndex(0);
              handleLoadMore(pageAmount, pagingOffset + pageAmount, "next");
            } else {
              setFocusIndex(rowIndex);
              handleLoadMore(pageAmount, rowIndex, "next");
            }
          }}
          sendMessage={sendMessage}
          loading={loadingNext}
          loadingMessage={message}
          disabled={isNextButtonDisabled}
          pagingButtonLabel={nextLabel}
          buttonStyle="none"
          bottomMargin0
          data-test-next-paging-button
          id={`${id || keyId}-next-paging-button`}
        />
      </div>
    </div>
  );
};

export default PrevNextPaginationRow;
