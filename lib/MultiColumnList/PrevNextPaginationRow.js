import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
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
  positionCache: PropTypes.object,
  prevWidth: PropTypes.number,
  rowHeightCache: PropTypes.object,
  rowIndex: PropTypes.number,
  rowWidth: PropTypes.number,
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
  staticBody: PropTypes.bool,
  virtualize: PropTypes.bool,
  width: PropTypes.number
};

const PrevNextPaginationRow = ({
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
          style={{
            width: `${rowWidth}px`,
            position: virtualize ? 'absolute' : 'relative',
            top: `${position}px`,
            marginTop: '1rem'
          }}
        >
          <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
            { ([message]) => (
              <CenteredContainer
                width={width || prevWidth || undefined}
                visible
                style={{ position: 'sticky' }}
              >
                <div style={{ display: 'flex', alignContent: 'space-between' }}>
                  <PagingButton
                    rowIndex={rowIndex}
                    onClick={() => {
                      // setFocusIndex(rowIndex);
                      handleLoadMore(pageAmount, rowIndex - (pageAmount * 2));
                      
                    }}
                    sendMessage={sendMessage}
                    loadingMessage={message}
                    loading={loading}
                    pagingButtonLabel={<FormattedMessage id="stripes-components.previous" />}
                    gridId={id || keyId}
                  />
                  <PagingButton
                    rowIndex={rowIndex}
                    onClick={() => {
                      // setFocusIndex(rowIndex);
                      handleLoadMore(pageAmount, rowIndex);
                    }}
                    sendMessage={sendMessage}
                    loadingMessage={message}
                    loading={loading}
                    pagingButtonLabel={<FormattedMessage id="stripes-components.next" />}
                    gridId={id || keyId}
                  />
                </div>
              </CenteredContainer>
            )}
          </FormattedMessage>
        </div>
      )}
    </RowPositioner>
  );
};

PrevNextPaginationRow.propTypes = propTypes;

export default PrevNextPaginationRow;
