import { map } from 'lodash';

import List from '../List';
import NoValue from '../NoValue';

const changedFieldsFormatter = ({
  fieldFormatter,
  fieldValue,
  fieldName,
  listItemFormatter,
}) => {
  if (fieldValue === false) return fieldValue.toString();

  if (!fieldValue) return <NoValue />;

  if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
    return (
      <List
        items={map(fieldValue, (value, name) => ({ name, value }))}
        itemFormatter={listItemFormatter}
        listStyle="bullets"
        marginBottom0
      />
    );
  }

  if (Array.isArray(fieldValue)) {
    return (
      <List
        items={fieldValue}
        listStyle="bullets"
        marginBottom0
      />
    );
  }

  return fieldFormatter?.[fieldName]?.(fieldValue) || fieldValue;
};

export default changedFieldsFormatter;
