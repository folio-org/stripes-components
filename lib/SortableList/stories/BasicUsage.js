import React from 'react';

import SortableList from '../SortableList';

export default class BasicUsage extends React.Component {
  constructor() {
    super();

    this.state = {
      contentData: [
        {
          id: 'id_0',
          index: 0,
          label: 'Option 1',
        },
        {
          id: 'id_1',
          index: 1,
          label: 'Option 2',
        }, {
          id: 'id_2',
          index: 2,
          label: 'Option 3',
        },
      ]
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const { index: destIndex } = destination;
    const { index: startIndex } = source;

    this.setState(({ contentData }) => {
      const options = [...contentData];
      const temporary = options[startIndex];
      options[startIndex] = options[destIndex];
      options[destIndex] = temporary;

      return {
        contentData: options,
      };
    });
  }

  render() {
    const { contentData } = this.state;

    return (
      <>
        <div id="ModuleContainer" />
        <SortableList
          onDragEnd={this.handleDragEnd}
          contentData={contentData}
          visibleColumns={['id', 'label']}
        />
      </>
    );
  }
}
