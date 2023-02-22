import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PagingButton from './PagingButton';

const propTypes = {
  dataEndReached: PropTypes.bool,
  handleLoadMore: PropTypes.func,
  id: PropTypes.string,
  keyId: PropTypes.string,
  loading: PropTypes.bool,
  pageAmount: PropTypes.number,
  pagingButtonLabel: PropTypes.node,
  rowContainerElement: PropTypes.instanceOf(Element),
  sendMessage: PropTypes.func,
  setFocusIndex: PropTypes.func,
};

const LoadMorePaginationRow = ({
  dataEndReached,
  handleLoadMore,
  id,
  keyId,
  loading,
  pageAmount,
  pagingButtonLabel,
  rowContainerElement,
  sendMessage,
  setFocusIndex,
}) => {
  if (dataEndReached) { return null; }

  return (
    <div style={{
      paddingTop: '0.5rem',
      display: 'flex',
      justifyContent: 'center',
    }}
    >
      <FormattedMessage id="stripes-components.mcl.itemsRequestedMessage">
        { ([message]) => (
          <PagingButton
            onClick={() => {
              if (rowContainerElement) {
                const rows = rowContainerElement.querySelectorAll('[role=row]');
                const lastRowString = rows[rows.length - 1].getAttribute('data-row-index');
                const lastRowIndex = parseInt(lastRowString.replace('row-', ''), 10);
                const rowIndex = lastRowIndex + 1;
                setFocusIndex(rowIndex);
                handleLoadMore(pageAmount, rowIndex);
              }
            }}
            sendMessage={sendMessage}
            loadingMessage={message}
            disabled={loading}
            pagingButtonLabel={pagingButtonLabel}
            data-button-id="load-more"
            id={`${id || keyId}-clickable-paging-button`}
            style={{ width: '75%' }}
          />
        )}
      </FormattedMessage>
    </div>
  );
};

LoadMorePaginationRow.propTypes = propTypes;

export default LoadMorePaginationRow;
