import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import css from './MultiSelect.css';

const SelectedValuesList = ({
  valueLabelId,
  valueDescriptionId,
  id,
  renderSelectedItems,
  listRef
}) => (
  <div className={css.multiSelectValueListContainer} id={id}>
    <span className="sr-only" id={valueLabelId}>
      <FormattedMessage id="stripes-components.multiSelection.removeSelectedButtonLabel" />
    </span>
    <span className="sr-only" id={valueDescriptionId}>
      <FormattedMessage id="stripes-components.multiSelection.removeSelectedButtonDescription" />
    </span>
    <ul
      className={css.multiSelectValueList}
      ref={listRef}
    >
      {renderSelectedItems()}
    </ul>
  </div>
);

SelectedValuesList.propTypes = {
  id: PropTypes.string,
  valueDescriptionId: PropTypes.string,
  valueLabelId: PropTypes.string,
  renderSelectedItems: PropTypes.func,
  listRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default SelectedValuesList;
