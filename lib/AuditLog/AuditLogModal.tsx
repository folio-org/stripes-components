// @ts-nocheck
import { FormattedMessage } from "react-intl";

import Button from "../Button";
import Modal from "../Modal";
import MultiColumnList from "../MultiColumnList";

import changedFieldsFormatter from "./changedFieldsFormatter";
type AuditLogModalProps = {
  actionsMap?: Record<string, any>;
  columnWidths?: Record<string, any>;
  contentData: {
    changeType?: string;
    fieldName?: string;
    newValue?: any;
    oldValue?: any;
  }[];
  fieldFormatter?: Record<string, any>;
  fieldLabelsMap?: Record<string, any>;
  itemFormatter?: (...args: any[]) => any;
  label: React.ReactNode;
  onClose?: (...args: any[]) => any;
  open: boolean;
};

const AuditLogModal = ({
  actionsMap,
  columnWidths,
  contentData,
  fieldFormatter,
  itemFormatter,
  fieldLabelsMap,
  label,
  onClose,
  open,
}: AuditLogModalProps) => {
  const visibleColumns = ["action", "field", "changedFrom", "changedTo"];
  const columnMapping = {
    action: <FormattedMessage id="stripes-components.auditLog.modal.action" />,
    field: <FormattedMessage id="stripes-components.auditLog.modal.field" />,
    changedFrom: (
      <FormattedMessage id="stripes-components.auditLog.modal.changedFrom" />
    ),
    changedTo: (
      <FormattedMessage id="stripes-components.auditLog.modal.changedTo" />
    ),
  };

  const defaultItemFormatter = (field, i) => {
    return (
      <li key={i}>
        {fieldFormatter?.[field.name]?.(field.value) || field.value}
      </li>
    );
  };

  const formatter = {
    action: (item) => actionsMap?.[item.changeType] || item.changeType,
    field: (item) => fieldLabelsMap?.[item.fieldName] || item.fieldName,
    changedFrom: (item) =>
      changedFieldsFormatter({
        fieldValue: item.oldValue,
        fieldName: item.fieldName,
        listItemFormatter: itemFormatter || defaultItemFormatter,
        fieldFormatter,
      }),
    changedTo: (item) =>
      changedFieldsFormatter({
        fieldValue: item.newValue,
        fieldName: item.fieldName,
        listItemFormatter: itemFormatter || defaultItemFormatter,
        fieldFormatter,
      }),
  };

  const modalFooter = (
    <Button onClick={onClose} buttonStyle="primary" marginBottom0>
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

export default AuditLogModal;
