import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';

import MCLRenderer from './MCLRenderer';

const propTypes = {
  autosize: PropTypes.bool,
};

const MultiColumnList = (props) => {
  if (props.autosize) {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <MCLRenderer {...props} height={height} width={width} />
        )
        }
      </AutoSizer>
    );
  }

  return <MCLRenderer {...props} />;
};

MultiColumnList.propTypes = propTypes;

export default MultiColumnList;
