import React from 'react';
import PropTypes from 'prop-types';
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
              Record last updated:
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
                Source:
                &nbsp;
                <span>{lastUpdatedBy}</span>
              </div>
            }
            {createdDate &&
              <div className={css.metaSectionContentBlock}>
                Record created:
                &nbsp;
                {this.formatDate(createdDate)}
                &nbsp;
                {this.formatTime(createdDate)}
              </div>
            }
            {createdBy &&
              <div className={css.metaSectionContentBlock}>
                Source:
                &nbsp;
                <span>{createdBy}</span>
              </div>
            }
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
