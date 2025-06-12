import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqWith from 'lodash/uniqWith';

import Button from '../Button';
import List from '../List';

const deduplicateFieldChanges = fieldChanges => {
  return uniqWith(fieldChanges, (a, b) => a.fieldName === b.fieldName && a.changeType === b.changeType);
};

const AuditLogChangedFieldsList = ({
  actionsMap,
  fieldChanges,
  fieldLabelsMap,
  isCurrentVersion,
  onChangeButtonClick,
}) => {
  const uniqueFieldChanges = deduplicateFieldChanges(fieldChanges);

  if (!fieldChanges?.length) return '';

  const itemFormatter = (item, i) => {
    const {
      fieldName,
      changeType,
    } = item;

    return (
      <li key={i}>
        {`${fieldLabelsMap?.[fieldName] || fieldName} (${actionsMap?.[changeType] || changeType})`}
      </li>
    );
  };

  return (
    <>
      {isCurrentVersion
        ? (
          <>
            <b><i><FormattedMessage id="stripes-components.auditLog.card.currentVersion" /></i></b>
            <br />
          </>
        )
        : null
      }
      <Button
        buttonStyle="link"
        onClick={onChangeButtonClick}
      >
        <b><FormattedMessage id="stripes-components.auditLog.card.changed" /></b>
      </Button>
      <List
        items={uniqueFieldChanges}
        itemFormatter={itemFormatter}
        listStyle="bullets"
        marginBottom0
      />
    </>
  );
};

AuditLogChangedFieldsList.propTypes = {
  actionsMap: PropTypes.object,
  fieldChanges: PropTypes.arrayOf(PropTypes.shape({
    changeType: PropTypes.string,
    fieldName: PropTypes.string,
  })).isRequired,
  fieldLabelsMap: PropTypes.object,
  isCurrentVersion: PropTypes.bool,
  onChangeButtonClick: PropTypes.func,
};

export default AuditLogChangedFieldsList;
