import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '../Loading';

import Button from '../Button';

const PagingButton = ({ loading, onClick, loadingMessage, pagingButtonLabel, sendMessage, ...props }) => {
  const handleClick = () => {
    sendMessage(loadingMessage);
    onClick();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        data-test-paging-button
        {... props}
      >
        {!loading && pagingButtonLabel}
        {loading && <Loading size="medium" useCurrentColor />}
      </Button>
    </>
  );
};

PagingButton.propTypes = {
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  onClick: PropTypes.func,
  pagingButtonLabel: PropTypes.node,
  sendMessage: PropTypes.func,
};

export default PagingButton;
