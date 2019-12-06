import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Loading } from '../Loading';
import SRStatus from '../SRStatus';
import Button from '../Button';

const PagingButton = ({ loading, onClick, loadingMessage }) => {
  const status = React.createRef();
  const handleClick = () => {
    status.current.sendMessage(loadingMessage);
    onClick();
  };

  return (
    <React.Fragment>
      <Button
        disabled={loading}
        onClick={handleClick}
        style={{ width: '75%' }}
      >
        {!loading && <FormattedMessage id="stripes-components.mcl.loadMore" />}
        {loading && <Loading size="medium" useCurrentColor />}
      </Button>
      <SRStatus ref={status} />
    </React.Fragment>
  );
};

PagingButton.propTypes = {
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  onClick: PropTypes.func,
};

PagingButton.defaultProps = {
  loadingMessage: 'Requesting more results'
};

export default PagingButton;
