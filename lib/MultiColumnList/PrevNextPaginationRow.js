import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import Icon from '../Icon';
import PagingButton from './PagingButton';
import css from './MCLRenderer.css';

const propTypes = {
  activeNext: PropTypes.bool,
  activePrevious: PropTypes.bool,
  containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  dataEndIndex: PropTypes.number,
  dataEndReached: PropTypes.bool,
  dataStartIndex: PropTypes.number,
  handleLoadMore: PropTypes.func,
  hidePageIndices: PropTypes.bool,
  id: PropTypes.string,
  keyId: PropTypes.string,
  loading: PropTypes.bool,
  pageAmount: PropTypes.number,
  pagingOffset: PropTypes.number,
  rowIndex: PropTypes.number,
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
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
  pageAmount,
  pagingOffset,
  rowIndex,
  sendMessage,
  dataStartIndex,
  dataEndIndex,
  hidePageIndices,
  setFocusIndex,
}) => {
  const { formatMessage } = useIntl();
  if (dataEndReached) { return null; }

  const isNextButtonDisabled = loading || !activeNext;
  const isPrevButtonDisabled = loading || !activePrevious;

  const previousLabel = (
    <div data-test-pagination-previous>
      <Icon size="small" icon="caret-left">
        <span>{formatMessage({ id: 'stripes-components.previous' })}</span>
      </Icon>
    </div>
  );

  const nextLabel = (
    <div data-test-pagination-next>
      <Icon size="small" icon="caret-right" iconPosition="end">
        <span>{formatMessage({ id: 'stripes-components.next' })}</span>
      </Icon>
    </div>
  );

  const message = formatMessage({ id: 'stripes-components.mcl.itemsRequestedMessage' });

  return (
    <div style={{ padding: '8px 0' }} ref={containerRef}>
      <div className={css.mclPaginationCenterContainer}>
        <PagingButton
          onClick={() => {
            if (typeof pagingOffset !== 'undefined') {
              setFocusIndex(0);
              handleLoadMore(pageAmount, pagingOffset - pageAmount, 'prev');
            } else {
              const remainder = rowIndex % pageAmount;

              const rowIndexForPrevButton = remainder === 0
                ? rowIndex - (pageAmount * 2)
                : rowIndex - (pageAmount + remainder);

              setFocusIndex(rowIndexForPrevButton);
              handleLoadMore(pageAmount, rowIndexForPrevButton, 'prev');
            }
          }}
          sendMessage={sendMessage}
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
            if (typeof pagingOffset !== 'undefined') {
              setFocusIndex(0);
              handleLoadMore(pageAmount, pagingOffset + pageAmount, 'next');
            } else {
              setFocusIndex(rowIndex);
              handleLoadMore(pageAmount, rowIndex, 'next');
            }
          }}
          sendMessage={sendMessage}
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

PrevNextPaginationRow.propTypes = propTypes;

export default PrevNextPaginationRow;
