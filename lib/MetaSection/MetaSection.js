import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Accordion } from '../Accordion';
import MetaAccordionHeader from './MetaAccordionHeader';
import css from './MetaSection.css';

const propTypes = {
  contentId: PropTypes.string,
  createdBy: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string,
      personal: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        middleName: PropTypes.string,
      }),
    }),
    PropTypes.node, // Passing a node will _not_ render a link to the user record
  ]),
  createdDate: PropTypes.string,
  id: PropTypes.string,
  lastUpdatedBy: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string,
      personal: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        middleName: PropTypes.string,
      }),
    }),
    PropTypes.node, // Passing a node will _not_ render a link to the user record
  ]),
  lastUpdatedDate: PropTypes.string,
  showUserLink: PropTypes.bool,
};

const defaultProps = {
  showUserLink: false,
};

class MetaSection extends React.Component {
  renderName(user) {
    const lastName = get(user, ['personal', 'lastName'], '');
    const firstName = get(user, ['personal', 'firstName'], '');
    const middleName = get(user, ['personal', 'middleName'], '');

    return `${lastName}${firstName ? ', ' : ' '}${firstName} ${middleName}`;
  }

  renderUser = (user) => {
    if (typeof user === 'string' || isValidElement(user)) return user;

    const { showUserLink } = this.props;

    const name = this.renderName(user);

    if (showUserLink) {
      return <Link to={`/users/view/${user.id}`}>{name}</Link>;
    } else {
      return name;
    }
  }

  render() {
    const {
      lastUpdatedDate,
      lastUpdatedBy,
      createdDate,
      createdBy
    } = this.props;

    const lastUpdatedLabel = lastUpdatedDate ?
      <FormattedMessage
        id="stripes-components.metaSection.recordLastUpdated"
        values={{
          date: <FormattedDate value={lastUpdatedDate} />,
          time: <FormattedTime value={lastUpdatedDate} />,
        }}
      />
      :
      <FormattedMessage id="stripes-components.metaSection.recordLastUpdatedNoData" />;

    const lastUpdatedByLabel = lastUpdatedBy ?
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{ source: this.renderUser(lastUpdatedBy) }}
      />
      :
      <FormattedMessage id="stripes-components.metaSection.sourceNoData" />;

    const createdLabel = createdDate ?
      <FormattedMessage
        id="stripes-components.metaSection.recordCreated"
        values={{
          date: <FormattedDate value={createdDate} />,
          time: <FormattedTime value={createdDate} />
        }}
      />
      :
      <FormattedMessage id="stripes-components.metaSection.recordCreatedNoData" />;

    const createdByLabel = createdBy ?
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{ source: this.renderUser(createdBy) }}
      />
      :
      <FormattedMessage id="stripes-components.metaSection.sourceNoData" />;

    return (
      <div className={css.metaSectionRoot}>
        <Accordion
          header={MetaAccordionHeader}
          closedByDefault
          id={this.props.id}
          contentId={this.props.contentId}
          label={lastUpdatedLabel}
        >
          <div className={css.metaSectionContent}>
            <div className={css.metaSectionContentBlock}>
              {lastUpdatedByLabel}
            </div>
            <div className={css.metaSectionGroup}>
              <div className={css.metaSectionContentBlock}>
                {createdLabel}
              </div>
              <div className={css.metaSectionContentBlock}>
                {createdByLabel}
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    );
  }
}

MetaSection.propTypes = propTypes;
MetaSection.defaultProps = defaultProps;

export default MetaSection;
