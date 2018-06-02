import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '../Accordion';
import MetaAccordionHeader from './MetaAccordionHeader';
import css from './MetaSection.css';

const propTypes = {
  lastUpdatedDate: PropTypes.string,
  lastUpdatedBy: PropTypes.string,
  createdDate: PropTypes.string,
  createdBy: PropTypes.string,
  id: PropTypes.string,
  contentId: PropTypes.string,
};

class MetaSection extends React.Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    const stripes = context.stripes;
    this.formatDate = stripes.formatDate;
    this.formatTime = stripes.formatTime;
  }

  render() {
    const {
      lastUpdatedDate,
      lastUpdatedBy,
      createdDate,
      createdBy,
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
              values={{ date: this.formatDate(lastUpdatedDate), time: this.formatTime(lastUpdatedDate) }}
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
                      values={{ date: this.formatDate(createdDate), time: this.formatTime(createdDate) }}
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

MetaSection.contextTypes = {
  stripes: PropTypes.shape({
    formatDate: PropTypes.func.isRequired,
    formatTime: PropTypes.func.isRequired,
  }).isRequired,
};

MetaSection.propTypes = propTypes;

export default MetaSection;
