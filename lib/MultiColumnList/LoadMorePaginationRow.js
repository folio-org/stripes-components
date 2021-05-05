import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PagingButton from './PagingButton';
import RowPositioner from './RowPositioner';
import CenteredContainer from './CenteredContainer';

const propTypes = {
  dataEndReached: PropTypes.bool,
  handleLoadMore: PropTypes.func,
  id: PropTypes.string,
  keyId: PropTypes.string,
  loading: PropTypes.bool,
  pageAmount: PropTypes.number,
  pagingButtonLabel: PropTypes.node,
  pagingButtonRef: PropTypes.object,
  positionCache: PropTypes.object,
  prevWidth: PropTypes.number,
  rowHeightCache: PropTypes.object,
  rowIndex: PropTypes.number,
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
  staticBody: PropTypes.bool,
  virtualize: PropTypes.bool,
  width: PropTypes.number
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
}) => {
  if (dataEndReached) { return null; }

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
          style={{ position: virtualize ? 'absolute' : 'relative', top: `${position}px`, marginTop: '1rem' }}
        >
          <CenteredContainer
            width={width || prevWidth || undefined}
            innerRef={pagingButtonRef}
            visible
          >
            <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
              { ([message]) => (
                <PagingButton
                  rowIndex={rowIndex}
                  onClick={() => {
                    setFocusIndex(rowIndex);
                    handleLoadMore(pageAmount, rowIndex);
                  }}
                  sendMessage={sendMessage}
                  loadingMessage={message}
                  loading={loading}
                  pagingButtonLabel={pagingButtonLabel}
                  gridId={id || keyId}
                />
              )}
            </FormattedMessage>
          </CenteredContainer>
        </div>
      )}
    </RowPositioner>
  );
};

LoadMorePaginationRow.propTypes = propTypes;

export default LoadMorePaginationRow;
