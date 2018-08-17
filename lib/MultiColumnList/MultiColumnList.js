import React from 'react';
import PropTypes from 'prop-types';
import Autosizer from './Autosizer';
import MCLRenderer from './MCLRenderer';

const propTypes = {
  autosize: PropTypes.bool,
};

const MultiColumnList = (props) => {
  if (props.autosize) {
    return (
      <Autosizer>
        {({ height, width }) => (
          <MCLRenderer {...props} height={height} width={width} />
        )
        }
      </Autosizer>
    );
  }

  return <MCLRenderer {...props} />;
};

MultiColumnList.propTypes = propTypes;

export default MultiColumnList;
