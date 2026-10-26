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

  // the CSS grid sizes itself to its container (see `autosize` in MCLGrid), so it
  // doesn't need AutoSizer's zero-size wrapper and measured height/width.
  if (props.autosize && !props.useCSSGrid) {
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
