import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Loading } from '../Loading';

import Button from '../Button';

const PagingButton = ({ loading, onClick, loadingMessage, sendMessage }) => {
  const handleClick = () => {
    sendMessage(loadingMessage);
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
    </React.Fragment>
  );
};

PagingButton.propTypes = {
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  onClick: PropTypes.func,
  sendMessage: PropTypes.func
};

PagingButton.defaultProps = {
  loadingMessage: 'Requesting more results, will focus next row when they arrive'
};

export default PagingButton;
