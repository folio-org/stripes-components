import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import PagingButton from './PagingButton';
import RowPositioner from './RowPositioner';
import css from './MCLRenderer.css';

const propTypes = {
  dataEndIndex: PropTypes.number,
  dataEndReached: PropTypes.bool,
  dataStartIndex: PropTypes.number,
  handleLoadMore: PropTypes.func,
  hidePageIndices: PropTypes.bool,
  id: PropTypes.string,
  keyId: PropTypes.string,
  pageAmount: PropTypes.number,
  positionCache: PropTypes.object,
  rowHeightCache: PropTypes.object,
  rowIndex: PropTypes.number,
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
  staticBody: PropTypes.bool,
  virtualize: PropTypes.bool,
};

const PrevNextPaginationRow = ({
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  pageAmount,
  positionCache,
  rowHeightCache,
  rowIndex,
  sendMessage,
  staticBody,
  virtualize,
  dataStartIndex,
  dataEndIndex,
  hidePageIndices,
  setFocusIndex,
}) => {
  if (dataEndReached) { return null; }

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
              <div className={css.mclPrevNextStickyContainer}>
                <div className={css.mclPaginationCenterContainer}>
                  <div className={css.mclPrevNextButtonContainer}>
                    <PagingButton
                      onClick={() => {
                        const remainder = rowIndex % pageAmount;

                        const rowIndexForPrevButton = remainder === 0
                          ? rowIndex - (pageAmount * 2)
                          : rowIndex - (pageAmount + remainder);

                        setFocusIndex(rowIndexForPrevButton);
                        handleLoadMore(pageAmount, rowIndexForPrevButton, 'prev');
                      }}
                      sendMessage={sendMessage}
                      loadingMessage={message}
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
                        setFocusIndex(rowIndex);
                        handleLoadMore(pageAmount, rowIndex, 'next');
                      }}
                      sendMessage={sendMessage}
                      loadingMessage={message}
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
