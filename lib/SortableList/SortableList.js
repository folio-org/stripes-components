import React from 'react';
import { uniqueId, noop } from 'lodash';
import PropTypes from 'prop-types';
import {
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';

import MultiColumnList from '../MultiColumnList';

import draggableRowFormatter from './draggableRowFormatter';

const propTypes = {
  className: PropTypes.string,
  droppableId: PropTypes.string,
  id: PropTypes.string,
  isRowDraggable: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  rowFormatter: PropTypes.func,
  rowProps: PropTypes.object,
};

const SortableList = ({
  droppableId,
  onDragEnd,
  onDragStart,
  onDragUpdate,
  rowFormatter,
  isRowDraggable,
  rowProps,
  id,
  className,
  ...rest
}) => {
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            id={id}
            className={className}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <MultiColumnList
              {...rest}
              rowFormatter={rowFormatter}
              rowProps={{
                ...rowProps,
                rowsCount: rest.contentData.length,
                isRowDraggable,
                isDraggingOver: snapshot.isDraggingOver,
                placeholder: provided.placeholder,
              }}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

SortableList.defaultProps = {
  droppableId: uniqueId('droppable'),
  rowFormatter: draggableRowFormatter,
  isRowDraggable: () => true,
  onDragEnd: noop,
  onDragStart: noop,
  onDragUpdate: noop,
  id: uniqueId('sortable-list-'),
  className: '',
  rowProps: {},
};

SortableList.propTypes = propTypes;

export default SortableList;
