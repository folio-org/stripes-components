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
        <AuditLogChangedFieldsList
          actionsMap={actionsMap}
          fieldChanges={fieldChanges}
          fieldLabelsMap={fieldLabelsMap}
          onChangeButtonClick={onChangeButtonClick}
        />
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
  source: PropTypes.oneOf([PropTypes.string, PropTypes.node]).isRequired,
  userName: PropTypes.oneOf([PropTypes.string, PropTypes.node]).isRequired,
};

export default AuditLogCard;
