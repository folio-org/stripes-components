import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import ValueChip from './ValueChip';
import css from './MultiSelect.css';

class SelectedValuesList extends React.Component {
  static propTypes = {
    atSmallMedia: PropTypes.bool,
    formatter: PropTypes.func,
    getRemoveButtonProps: PropTypes.func,
    id: PropTypes.string,
    inputRef: PropTypes.object,
    intl: intlShape.isRequired,
    itemToString: PropTypes.func,
    selectedItems: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    valueDescriptionId: PropTypes.string,
    valueLabelId: PropTypes.string,
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.removeButtonUsed === -1 && this.props.removeButtonUsed !== -1) {
  //     this.handleFocusAfterRemoval(this.props.removeButtonUsed);
  //   }
  // }

  valueList = React.createRef();

  handleRemoveButtonKeyDown = e => {
    switch (e.keyCode) {
      case 35: // end
        this.valueList.current.querySelector('li:last-child button').focus();
        break;
      case 36: // home
        this.valueList.current.querySelector('li:first-child button').focus();
        break;
      default:
    }
  };

  handleFocusAfterRemoval = index => {
    if (
      this.valueList.current &&
      this.valueList.current.childNodes.length - 1 >= index
    ) {
      const targetButton = this.valueList.current.querySelector(`li:nth-child(${index + 1}n) button`);
      targetButton.focus();
    } else if (!this.props.atSmallMedia) {
      this.props.inputRef.current.focus();
    }
  };

  render() {
    const {
      selectedItems,
      getRemoveButtonProps,
      valueLabelId,
      valueDescriptionId,
      itemToString,
      intl,
      id,
      formatter,
    } = this.props;

    if (selectedItems && selectedItems.length > 0) {
      return (
        <div className={css.multiSelectValueListContainer} id={id}>
          <span className="sr-only" id={valueLabelId}>
            {intl.formatMessage({ id: 'stripes-components.multiSelection.removeSelectedButtonLabel' })}
          </span>
          <span className="sr-only" id={valueDescriptionId}>
            {intl.formatMessage({ id: 'stripes-components.multiSelection.removeSelectedButtonDescription' })}
          </span>
          <ul
            className={css.multiSelectValueList}
            ref={this.valueList}
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
                  index,
                  onKeyDown: this.handleRemoveButtonKeyDown,
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
