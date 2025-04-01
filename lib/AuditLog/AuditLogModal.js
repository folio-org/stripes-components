import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Button from '../Button';
import Modal from '../Modal';
import MultiColumnList from '../MultiColumnList';

import changedFieldsFormatter from './changedFieldsFormatter';

const AuditLogModal = ({
  actionsMap,
  columnWidths,
  contentData,
  fieldFormatter,
  fieldLabelsMap,
  label,
  onClose,
  open,
}) => {
  const visibleColumns = ['action', 'field', 'changedFrom', 'changedTo'];
  const columnMapping = {
    action: <FormattedMessage id="stripes-components.auditLog.modal.action" />,
    field: <FormattedMessage id="stripes-components.auditLog.modal.field" />,
    changedFrom: <FormattedMessage id="stripes-components.auditLog.modal.changedFrom" />,
    changedTo: <FormattedMessage id="stripes-components.auditLog.modal.changedTo" />,
  };

  const itemFormatter = (field, i) => {
    return (
      <li key={i}>
        {fieldFormatter?.[field.name]?.(field.value) || field.value}
      </li>
    );
  };
  const formatter = {
    action: item => actionsMap?.[item.changeType] || item.changeType,
    field: item => fieldLabelsMap?.[item.fieldName] || item.fieldName,
    changedFrom: item => changedFieldsFormatter({
      fieldValue: item.oldValue,
      fieldName: item.fieldName,
      listItemFormatter: itemFormatter,
      fieldFormatter,
    }),
    changedTo: item => changedFieldsFormatter({
      fieldValue: item.newValue,
      fieldName: item.fieldName,
      listItemFormatter: itemFormatter,
      fieldFormatter,
      showFalsyValue: true
    }),
  };

  const modalFooter = (
    <Button
      onClick={onClose}
      buttonStyle="primary"
      marginBottom0
    >
      <FormattedMessage id="stripes-components.close" />
    </Button>
  );

  return (
    <Modal
      open={open}
      label={label}
      onClose={onClose}
      footer={modalFooter}
      dismissible
      size="large"
    >
      <MultiColumnList
        contentData={contentData}
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        columnWidths={columnWidths}
        formatter={formatter}
        interactive={false}
      />
    </Modal>
  );
};

AuditLogModal.propTypes = {
  actionsMap: PropTypes.object,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.shape({
    changeType: PropTypes.string,
    fieldName: PropTypes.string,
    newValue: PropTypes.oneOf([PropTypes.string, PropTypes.array, PropTypes.object]),
    oldValue: PropTypes.oneOf([PropTypes.string, PropTypes.array, PropTypes.object]),
  })).isRequired,
  fieldFormatter: PropTypes.object,
  fieldLabelsMap: PropTypes.object,
  label: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default AuditLogModal;
