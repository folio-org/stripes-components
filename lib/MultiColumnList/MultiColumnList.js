import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';

import MCLRenderer from './MCLRenderer';
import MCLGrid from './MCLGrid';

const propTypes = {
  autosize: PropTypes.bool,
};

const MultiColumnList = (props) => {
  let GridComponent;
  if (props.useCSSGrid) {
    GridComponent = MCLGrid;
  } else {
    GridComponent = MCLRenderer;
  }

  if (props.autosize) {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <GridComponent {...props} height={height} width={width} />
        )
        }
      </AutoSizer>
    );
  }

  return <GridComponent {...props} />;
};

MultiColumnList.propTypes = propTypes;

export default MultiColumnList;
