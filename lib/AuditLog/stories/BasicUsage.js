import { useIntl } from 'react-intl';
import NoValue from '../../NoValue';
import AuditLogPane from '../AuditLogPane';

export default () => {
  const intl = useIntl();

  const versions = [{
    eventDate: '2025-02-28T12:00:42.183+00:00',
    source: 'lastName, firstName',
    userName: 'lastName, firstName',
    fieldChanges: [{
      fieldName: 'name',
      changeType: 'ADDED',
      newValue: 'newValue',
      oldValue: 'oldValue',
    }],
    eventId: '4ff9b7db-cb62-42fa-b52d-708cda1ba666',
    eventTs: 1740744042183,
  }];
  const fieldLabelsMap = {
    administrativeNotes: intl.formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    alternativeTitles: intl.formatMessage({ id: 'ui-inventory.alternativeTitles' }),
  };
  const fieldFormatter = {
    contributorTypeText: value => value || <NoValue />,
    primary: value => value.toString(),
  };
  const actionsMap = {
    ADDED: 'Added',
    REMOVED: 'Removed',
  }

  const onClose = () => {};
  const handleLoadMore = () => {};

  return (
    <AuditLogPane
      versions={versions}
      onClose={onClose}
      isLoadedMoreVisible={true}
      handleLoadMore={handleLoadMore}
      isLoading={false}
      fieldLabelsMap={fieldLabelsMap}
      fieldFormatter={fieldFormatter}
      actionsMap={actionsMap}
    />
  );
};
