import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Accordion } from '../Accordion';
import FormattedDate from '../FormattedDate';
import FormattedTime from '../FormattedTime';
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
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  hideSource: PropTypes.bool,
  id: PropTypes.string,
  inlineLayout: PropTypes.bool,
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
  noBackGround: PropTypes.bool,
  showUserLink: PropTypes.bool,
  useAccordion: PropTypes.bool,
};

const defaultProps = {
  hideSource: false,
  showUserLink: false,
  headingLevel: 4,
  inlineLayout: false,
  noBackGround: false,
  useAccordion: true,
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

    if (showUserLink && user.id) {
      return <Link to={`/users/view/${user.id}`} data-test-user-link>{name}</Link>;
    } else {
      return name;
    }
  }

  renderMetaSectionInAccordion = () => {
    const {
      createdBy,
      createdDate,
      hideSource,
      lastUpdatedBy,
    } = this.props;

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
      <div className={css.metaSectionContent}>
        {!hideSource &&
          <div className={css.metaSectionContentBlock} data-test-updated-by>
            {lastUpdatedByLabel}
          </div>
        }
        <div className={css.metaSectionGroup}>
          <div className={css.metaSectionContentBlock} data-test-created>
            {createdLabel}
          </div>
          {!hideSource &&
            <div className={css.metaSectionContentBlock} data-test-created-by>
              {createdByLabel}
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    // club all meta section content into renderMetaSection method
    const {
      headingLevel,
      hideSource,
      inlineLayout,
      lastUpdatedBy,
      lastUpdatedDate,
      noBackGround,
      useAccordion,
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

    return (
      <div
        className={css.metaSectionRoot}
        style={{
          'background-color': `${noBackGround ? 'unset' : 'var(--color-fill)'}`
        }}
        data-test-meta-section
      >
        {
          useAccordion ? (
            <Accordion
              header={MetaAccordionHeader}
              headerProps={{
                headingLevel
              }}
              closedByDefault
              id={this.props.id}
              contentId={this.props.contentId}
              label={lastUpdatedLabel}
            >
              {
              this.renderMetaSectionInAccordion()
            }
            </Accordion>
          ) : (
            <div
              className={css.metaSectionContent}
              style={inlineLayout ? { display: 'flex' } : { display: 'flex column' }
              }
            >
              <div style={{ marginRight: '5px' }}>
                <FormattedMessage id="stripes-components.metaSection.lastUpdated" />
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '5px' }}>
                  <FormattedMessage
                    id="stripes-components.metaSection.lastUpdatedDateTime"
                    values={{
                      date: <FormattedDate value={lastUpdatedDate} />,
                      time: <FormattedTime value={lastUpdatedDate} />,
                    }}
                  />
                </div>
                <div>
                  {
                    !hideSource && (
                      <FormattedMessage
                        id="stripes-components.metaSection.lastUpdatedBy"
                        values={{
                          source: lastUpdatedBy ? this.renderUser(lastUpdatedBy) :
                          <FormattedMessage
                            id="stripes-components.metaSection.unknownUser"
                          />
                        }}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

MetaSection.propTypes = propTypes;
MetaSection.defaultProps = defaultProps;

export default MetaSection;
