import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from '../Icon';
import PagingButton from './PagingButton';
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
  rowContainerElement: PropTypes.instanceOf(Element),
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
};

function getLastRowIndex(elem) {
  const rows = elem.querySelectorAll('[role=row]');
  const lastRowString = rows[rows.length - 1].getAttribute('data-row-index');
  const lastRowIndex = parseInt(lastRowString.replace('row-', ''), 10);
  return lastRowIndex + 1;
}

const PrevNextPaginationRow = ({
  activeNext,
  activePrevious,
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  loading,
  pageAmount,
  sendMessage,
  dataStartIndex,
  dataEndIndex,
  hidePageIndices,
  setFocusIndex,
  rowContainerElement,
}) => {
  if (dataEndReached) { return null; }

  const isNextButtonDisabled = loading || !activeNext;
  const isPrevButtonDisabled = loading || !activePrevious;

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
    <div
      key={`${id}-pagination-row`}
      style={{
        width: '100%',
        paddingTop: '1rem'
      }}
    >
      <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
        { ([message]) => (
          <div className={css.mclPrevNextStickyContainer}>
            <div className={css.mclPaginationCenterContainer}>
              <div className={css.mclPrevNextButtonContainer}>
                <PagingButton
                  onClick={() => {
                    if (rowContainerElement) {
                      const rowIndex = getLastRowIndex(rowContainerElement);
                      // see if we're on a partial (last) page...0 if not.
                      const remainder = rowIndex % pageAmount;

                      const rowIndexForPrevButton = remainder === 0
                        ? rowIndex - (pageAmount * 2)
                        : rowIndex - (pageAmount + remainder);

                      setFocusIndex('top');
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
                  data-button-id="previous"
                  id={`${id || keyId}-prev-paging-button`}
                />
                {!hidePageIndices && (
                  <div className={css.mclPrevNextPageInfoContainer}>
                    <div>{dataStartIndex}</div>&nbsp;-&nbsp;<div>{dataEndIndex}</div>
                  </div>
                )}
                <PagingButton
                  onClick={() => {
                    if (rowContainerElement) {
                      const rowIndex = getLastRowIndex(rowContainerElement);
                      setFocusIndex('top');
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
                  data-button-id="next"
                  id={`${id || keyId}-next-paging-button`}
                />
              </div>
            </div>
          </div>
        )}
      </FormattedMessage>
    </div>
  );
};

PrevNextPaginationRow.propTypes = propTypes;

export default PrevNextPaginationRow;
