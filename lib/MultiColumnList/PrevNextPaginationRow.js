import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import PagingButton from './PagingButton';
import RowPositioner from './RowPositioner';
import css from './MCLRenderer.css';

const propTypes = {
  activeNext: PropTypes.bool,
  activePrevious: PropTypes.bool,
  dataEndIndex: PropTypes.number,
  dataEndReached: PropTypes.bool,
  dataStartIndex: PropTypes.number,
  handleLoadMore: PropTypes.func,
  hidePageIndices: PropTypes.bool,
  id: PropTypes.string,
  keyId: PropTypes.string,
  loading: PropTypes.bool,
  pageAmount: PropTypes.number,
  paginationBoundaries: PropTypes.bool,
  positionCache: PropTypes.object,
  prevWidth: PropTypes.number,
  rowHeightCache: PropTypes.object,
  rowIndex: PropTypes.number,
  rowWidth: PropTypes.number,
  sendMessage: PropTypes.func,
  staticBody: PropTypes.bool,
  virtualize: PropTypes.bool,
  width: PropTypes.number
};

const PrevNextPaginationRow = ({
  activeNext,
  activePrevious,
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  loading,
  pageAmount,
  positionCache,
  prevWidth,
  rowHeightCache,
  rowIndex,
  rowWidth,
  sendMessage,
  staticBody,
  virtualize,
  width,
  dataStartIndex,
  dataEndIndex,
  paginationBoundaries,
  hidePageIndices
}) => {
  if (dataEndReached) { return null; }

  const widthVar = width || prevWidth;
  const scrollBarWidth = widthVar < rowWidth ? 17 : 0;
  const isNextButtonDisabled = paginationBoundaries && (loading || !activeNext);
  const isPrevButtonDisabled = paginationBoundaries && (loading || !activePrevious);

  const previousLabel = (
    <div data-test-pagination-previous>
      <Icon size="small" icon="caret-left">
        <FormattedMessage id="stripes-components.previous">
          { (text) => <span>{text}</span>}
        </FormattedMessage>
      </Icon>
    </div>
  );

  const nextLabel = (
    <div data-test-pagination-next>
      <Icon size="small" icon="caret-right" iconPosition="end">
        <FormattedMessage id="stripes-components.next">
          { (text) => <span>{text}</span>}
        </FormattedMessage>
      </Icon>
    </div>
  );

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
          key={`${localRowIndex}-pagination-row`}
          style={{
            width: '100%',
            position: virtualize ? 'absolute' : 'relative',
            top: `${position}px`,
            marginTop: '1rem'
          }}
        >
          <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
            { ([message]) => (
              <div
                style={{ width: `${(width || prevWidth) - scrollBarWidth}px` }}
                className={css.mclPrevNextStickyContainer}
              >
                <div className={css.mclPaginationCenterContainer}>
                  <div className={css.mclPrevNextButtonContainer}>
                    <PagingButton
                      onClick={() => {
                        // setFocusIndex(rowIndex);
                        const remainder = rowIndex % pageAmount;

                        const rowIndexForPrevButton = remainder === 0
                          ? rowIndex - (pageAmount * 2)
                          : rowIndex - (pageAmount + remainder);

                        handleLoadMore(pageAmount, rowIndexForPrevButton, 'prev');
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
                        // setFocusIndex(rowIndex);
                        handleLoadMore(pageAmount, rowIndex, 'next');
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
              </div>
            )}
          </FormattedMessage>
        </div>
      )}
    </RowPositioner>
  );
};

PrevNextPaginationRow.propTypes = propTypes;

export default PrevNextPaginationRow;
