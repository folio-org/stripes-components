// @ts-nocheck
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";

import MCLRenderer from "./MCLRenderer";
type MultiColumnListProps = { autosize?: boolean };

const MultiColumnList = (props: MultiColumnListProps) => {
  if (props.autosize) {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <MCLRenderer {...props} height={height} width={width} />
        )}
      </AutoSizer>
    );
  }

  return <MCLRenderer {...props} />;
};

export default MultiColumnList;
