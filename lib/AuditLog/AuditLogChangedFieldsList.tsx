// @ts-nocheck
import { FormattedMessage } from "react-intl";
import uniqWith from "lodash/uniqWith";

import Button from "../Button";
import List from "../List";
type AuditLogChangedFieldsListProps = {
  actionsMap?: Record<string, any>;
  fieldChanges: { changeType?: string; fieldName?: string }[];
  fieldLabelsMap?: Record<string, any>;
  isCurrentVersion?: boolean;
  onChangeButtonClick?: (...args: any[]) => any;
};

const deduplicateFieldChanges = (fieldChanges) => {
  return uniqWith(
    fieldChanges,
    (a, b) => a.fieldName === b.fieldName && a.changeType === b.changeType,
  );
};

const AuditLogChangedFieldsList = ({
  actionsMap,
  fieldChanges,
  fieldLabelsMap,
  isCurrentVersion,
  onChangeButtonClick,
}: AuditLogChangedFieldsListProps) => {
  const uniqueFieldChanges = deduplicateFieldChanges(fieldChanges);

  if (!fieldChanges?.length) return "";

  const itemFormatter = (item, i) => {
    const { fieldName, changeType } = item;

    return (
      <li key={i}>
        {`${fieldLabelsMap?.[fieldName] || fieldName} (${actionsMap?.[changeType] || changeType})`}
      </li>
    );
  };

  return (
    <>
      {isCurrentVersion ? (
        <>
          <b>
            <i>
              <FormattedMessage id="stripes-components.auditLog.card.currentVersion" />
            </i>
          </b>
          <br />
        </>
      ) : null}
      <Button buttonStyle="link" onClick={onChangeButtonClick}>
        <b>
          <FormattedMessage id="stripes-components.auditLog.card.changed" />
        </b>
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

export default AuditLogChangedFieldsList;
