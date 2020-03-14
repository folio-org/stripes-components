import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Loading } from '../Loading';

import Button from '../Button';

const PagingButton = ({ loading, onClick, loadingMessage, sendMessage, gridId }) => {
  const handleClick = () => {
    sendMessage(loadingMessage);
    onClick();
  };

  return (
    <>
      <Button
        disabled={loading}
        onClick={handleClick}
        style={{ width: '75%' }}
        data-test-paging-button
        id={`${gridId}-clickable-paging-button`}
      >
        {!loading && <FormattedMessage id="stripes-components.mcl.loadMore" />}
        {loading && <Loading size="medium" useCurrentColor />}
      </Button>
    </>
  );
};

PagingButton.propTypes = {
  gridId: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  onClick: PropTypes.func,
  sendMessage: PropTypes.func
};

export default PagingButton;
