// @ts-nocheck
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import Card from "../Card";

import AuditLogChangedFieldsList from "./AuditLogChangedFieldsList";
import AuditLogModal from "./AuditLogModal";

import css from "./AuditLogCard.css";
type AuditLogCardProps = {
  actionsMap?: Record<string, any>;
  columnWidths?: Record<string, any>;
  date: string;
  fieldChanges: Record<string, any>[];
  fieldFormatter?: Record<string, any>;
  fieldLabelsMap?: Record<string, any>;
  isCurrentVersion?: boolean;
  isOriginal?: boolean;
  itemFormatter?: (...args: any[]) => any;
  modalFieldChanges?: Record<string, any>[];
  showSharedLabel?: boolean;
  source: string | React.ReactNode;
  userName: string | React.ReactNode;
};

const AuditLogCard = ({
  actionsMap,
  columnWidths,
  date,
  fieldChanges,
  fieldFormatter,
  fieldLabelsMap,
  isOriginal,
  isCurrentVersion,
  itemFormatter,
  showSharedLabel,
  source,
  userName,
  modalFieldChanges,
}: AuditLogCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardHeader = <b>{date}</b>;
  const fieldChangesSource = (
    <FormattedMessage
      id="stripes-components.metaSection.source"
      tagName="p"
      values={{ source }}
    />
  );

  const modalHeader = (
    <>
      {date}
      <br />
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{ source: userName }}
      />
    </>
  );

  const originalVersionLabel = (
    <b>
      <i>
        <FormattedMessage
          id={`stripes-components.auditLog.card.${showSharedLabel ? "shared" : "originalVersion"}`}
        />
      </i>
    </b>
  );

  const onChangeButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        cardClass={css.card}
        headerStart={cardHeader}
        cardStyle="positive"
        headerProps={{ tabIndex: -1 }}
        roundedBorder
      >
        {fieldChangesSource}
        <p>
          {isOriginal ? (
            originalVersionLabel
          ) : (
            <AuditLogChangedFieldsList
              actionsMap={actionsMap}
              fieldChanges={fieldChanges}
              fieldLabelsMap={fieldLabelsMap}
              isCurrentVersion={isCurrentVersion}
              onChangeButtonClick={onChangeButtonClick}
            />
          )}
        </p>
      </Card>
      <AuditLogModal
        contentData={modalFieldChanges || fieldChanges}
        open={isModalOpen}
        label={modalHeader}
        onClose={() => setIsModalOpen(false)}
        fieldLabelsMap={fieldLabelsMap}
        fieldFormatter={fieldFormatter}
        itemFormatter={itemFormatter}
        actionsMap={actionsMap}
        columnWidths={columnWidths}
      />
    </>
  );
};

export default AuditLogCard;
