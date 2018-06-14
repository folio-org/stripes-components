import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';

import injectIntl from '../InjectIntl';
import { Accordion } from '../Accordion';
import MetaAccordionHeader from './MetaAccordionHeader';
import css from './MetaSection.css';

const propTypes = {
  contentId: PropTypes.string,
  createdBy: PropTypes.string,
  createdDate: PropTypes.string,
  id: PropTypes.string,
  intl: intlShape.isRequired,
  lastUpdatedBy: PropTypes.string,
  lastUpdatedDate: PropTypes.string,
};

class MetaSection extends React.Component {
  render() {
    const {
      lastUpdatedDate,
      lastUpdatedBy,
      createdDate,
      createdBy,
      intl
    } = this.props;

    return (
      <div className={css.metaSectionRoot}>
        <Accordion
          header={MetaAccordionHeader}
          closedByDefault
          id={this.props.id}
          contentId={this.props.contentId}
          label={
            <FormattedMessage
              id="stripes-components.metaSection.recordLastUpdated"
              values={{
                date: intl.formatDate(lastUpdatedDate),
                time: intl.formatTime(lastUpdatedDate)
              }}
            />
          }
        >
          <div className={css.metaSectionContent}>
            {lastUpdatedBy &&
              <div className={css.metaSectionContentBlock}>
                <FormattedMessage
                  id="stripes-components.metaSection.source"
                  values={{ source: lastUpdatedBy }}
                />
              </div>
            }
            { (createdDate || createdBy) && (
              <div className={css.metaSectionGroup}>
                {createdDate &&
                  <div className={css.metaSectionContentBlock}>
                    <FormattedMessage
                      id="stripes-components.metaSection.recordCreated"
                      values={{
                        date: intl.formatDate(createdDate),
                        time: intl.formatTime(createdDate)
                      }}
                    />
                  </div>
                }
                {createdBy &&
                  <div className={css.metaSectionContentBlock}>
                    <FormattedMessage
                      id="stripes-components.metaSection.source"
                      values={{ source: createdBy }}
                    />
                  </div>
                }
              </div>
            )}
          </div>
        </Accordion>
      </div>
    );
  }
}

MetaSection.propTypes = propTypes;

export default injectIntl(MetaSection);
