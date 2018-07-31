import React from 'react';
import PropTypes from 'prop-types';
import ValueChip from './ValueChip';
import css from './MultiSelect.css';

class SelectedValuesList extends React.Component {
  static propTypes = {
    formatter: PropTypes.func,
    getRemoveButtonProps: PropTypes.func,
    id: PropTypes.string,
    itemToString: PropTypes.func,
    onRemove: PropTypes.func,
    selectedItems: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    valueDescriptionId: PropTypes.string,
    valueLabelId: PropTypes.string,
  }

  selectedList = React.createRef();

  handleRemoveButtonKeyDown = e => {
    switch (e.keyCode) {
      case 35: // end
        this.selectedList.current.querySelector('li:last-child button').focus();
        break;
      case 36: // home
        this.selectedList.current
          .querySelector('li:first-child button')
          .focus();
        break;
      default:
    }
  };

  handleFocusAfterRemoval = index => {
    if (
      this.selectedList.current &&
      this.selectedList.current.childNodes.length >= index
    ) {
      const select = index === 0 ? 1 : index;
      this.selectedList.current
        .querySelector(`li:nth-child(${select}n) button`)
        .focus();
    } else {
      this.input.current.focus();
    }
  };

  render() {
    const {
      selectedItems,
      getRemoveButtonProps,
      valueLabelId,
      valueDescriptionId,
      onRemove,
      itemToString,
      id,
      formatter,
    } = this.props;

    if (selectedItems.length > 0) {
      return (
        <div className={css.multiSelectValueListContainer} id={id}>
          <span className="sr-only" id={valueLabelId}>
          remove value
          </span>
          <span className="sr-only" id={valueDescriptionId}>
            {`Press enter or spacebar to remove item from selection list.
            Home and end keys navigate to the first or last items.`}
          </span>
          <ul
            className={css.multiSelectValueList}
            ref={this.selectedList}
          >
            {selectedItems.map((item, index) => (
              <ValueChip
                key={`${itemToString(item)}-${index}`}
                id={`${itemToString(item)}-${index}`}
                controlLabelId={valueLabelId}
                descriptionId={valueDescriptionId}
                removeButtonProps={
                getRemoveButtonProps({
                item,
                onKeyDown: this.handleRemoveButtonKeyDown,
                afterRemoval: () => {
                  this.handleFocusAfterRemoval(index);
                  if (onRemove) {
                    onRemove(item);
                  }
                }
              })}
              >
                {formatter({ option: item })}
              </ValueChip>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }
}

export default SelectedValuesList;
