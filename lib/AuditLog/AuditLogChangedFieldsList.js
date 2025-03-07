import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Button from '../Button';
import List from '../List';

const AuditLogChangedFieldsList = ({
  actionsMap,
  fieldChanges,
  fieldLabelsMap,
  isFirst,
  showUserLink,
  onChangeButtonClick,
}) => {
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

  const versionLabel = (
    <b>
      <em>
        <FormattedMessage id={`stripes-components.auditLog.card.${isFirst ? 'currentVersion' : 'changed'}`} />
      </em>
    </b>
  );

  return (
    <>
      {showUserLink
        ? (
          <Button
            buttonStyle="link"
            onClick={onChangeButtonClick}
          >
            {versionLabel}
          </Button>
        )
        : versionLabel
      }
      <List
        items={fieldChanges}
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
  onChangeButtonClick: PropTypes.func,
  showUserLink: PropTypes.bool,
};

export default AuditLogChangedFieldsList;
