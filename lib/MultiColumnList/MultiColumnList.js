import React from 'react';
import Autosizer from './Autosizer';
import MCLRenderer from './MCLRenderer';

const MultiColumnList = (props) => {

  if(props.autosize){
    return (
      <Autosizer>
        {({ height, width }) =>
          (
            <MCLRenderer {...props} height={height} width={width} />
          )
        }
      </Autosizer>
    )
  }

  return <MCLRenderer {...props} />;
}

export default MultiColumnList;