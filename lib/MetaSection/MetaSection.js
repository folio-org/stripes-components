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

class MetaSection extends React.Component { // eslint-disable-line

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
            <div>
              <FormattedMessage id="stripes-components.metaSection.recordLastUpdated" />:
              &nbsp;
              <span className={css.metaHeaderValue}>
                {this.formatDate(lastUpdatedDate)}
                &nbsp;
                {this.formatTime(lastUpdatedDate)}
              </span>
            </div>
          }
        >
          <div className={css.metaSectionContent}>
            {lastUpdatedBy &&
              <div className={css.metaSectionContentBlock}>
                <FormattedMessage id="stripes-components.metaSection.source" />:
                &nbsp;
                <span>{lastUpdatedBy}</span>
              </div>
            }
            { (createdDate || createdBy) && (
              <div className={css.metaSectionGroup}>
                {createdDate &&
                  <div className={css.metaSectionContentBlock}>
                    <FormattedMessage id="stripes-components.metaSection.recordCreated" />:
                    &nbsp;
                    {this.formatDate(createdDate)}
                    &nbsp;
                    {this.formatTime(createdDate)}
                  </div>
                }
                {createdBy &&
                  <div className={css.metaSectionContentBlock}>
                    <FormattedMessage id="stripes-components.metaSection.source" />:
                    &nbsp;
                    <span>{createdBy}</span>
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
