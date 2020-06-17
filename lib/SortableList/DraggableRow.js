import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import css from './DraggableRow.css';

const getItemStyle = (draggableStyle) => {
  return {
    userSelect: 'none',
    ...draggableStyle,
  };
};

const propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  provided: PropTypes.object,
  rowClass: PropTypes.string,
  rowIndex: PropTypes.number,
  snapshot: PropTypes.object,
};

const DraggableRow = ({
  snapshot,
  provided,
  rowIndex,
  rowClass,
  cells,
}) => {
  const usePortal = snapshot.isDragging;
  const classNames = [rowClass];

  if (usePortal) {
    classNames.push(css.DraggableRow);
  }

  const Row = (
    <div
      id={`row-${rowIndex}`}
      data-test-draggable-row
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={`row-${rowIndex}`}
      className={classNames}
      role="row"
      tabIndex="0"
      style={getItemStyle(
        provided.draggableProps.style,
      )}
    >
      {cells}
    </div>
  );

  if (!usePortal) {
    return Row;
  }

  const container = document.getElementById('ModuleContainer');
  return ReactDOM.createPortal(Row, container);
};

DraggableRow.propTypes = propTypes;

export default DraggableRow;
