import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Card from '../Card';

import AuditLogChangedFieldsList from './AuditLogChangedFieldsList';
import AuditLogModal from './AuditLogModal';

import css from './AuditLogCard.css';

const AuditLogCard = ({
  actionsMap,
  columnWidths,
  date,
  fieldChanges,
  fieldFormatter,
  fieldLabelsMap,
  isOriginal,
  isCurrentVersion,
  source,
  userName,
}) => {
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
          id="stripes-components.auditLog.card.originalVersion"
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
          {isOriginal
            ? originalVersionLabel
            : (
              <AuditLogChangedFieldsList
                actionsMap={actionsMap}
                fieldChanges={fieldChanges}
                fieldLabelsMap={fieldLabelsMap}
                isCurrentVersion={isCurrentVersion}
                onChangeButtonClick={onChangeButtonClick}
              />
            )
          }
        </p>
      </Card>
      <AuditLogModal
        contentData={fieldChanges}
        open={isModalOpen}
        label={modalHeader}
        onClose={() => setIsModalOpen(false)}
        fieldLabelsMap={fieldLabelsMap}
        fieldFormatter={fieldFormatter}
        actionsMap={actionsMap}
        columnWidths={columnWidths}
      />
    </>
  );
};

AuditLogCard.propTypes = {
  actionsMap: PropTypes.object,
  columnWidths: PropTypes.object,
  date: PropTypes.string.isRequired,
  fieldChanges: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldFormatter: PropTypes.object,
  fieldLabelsMap: PropTypes.object,
  isCurrentVersion: PropTypes.bool,
  isOriginal: PropTypes.bool,
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  userName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default AuditLogCard;
