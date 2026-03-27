// @ts-nocheck
import React, { isValidElement } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { get } from "lodash";

import { Accordion } from "../Accordion";
import FormattedDate from "../FormattedDate";
import FormattedTime from "../FormattedTime";
import { Loading } from "../Loading";
import MetaAccordionHeader from "./MetaAccordionHeader";
import css from "./MetaSection.css";
type MetaSectionProps = {
  contentId?: string;
  createdBy?:
    | {
        id?: string;
        personal?: {
          firstName?: string;
          lastName?: string;
          middleName?: string;
        };
      }
    | React.ReactNode;
  createdDate?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  hideSource?: boolean;
  id?: string;
  inlineLayout?: boolean;
  isLoading?: boolean;
  lastUpdatedBy?:
    | {
        id?: string;
        personal?: {
          firstName?: string;
          lastName?: string;
          middleName?: string;
        };
      }
    | React.ReactNode;
  lastUpdatedDate?: string;
  noBackGround?: boolean;
  showUserLink?: boolean;
  useAccordion?: boolean;
};

const defaultProps = {
  hideSource: false,
  showUserLink: false,
  headingLevel: 4,
  useAccordion: true,
};

class MetaSection extends React.Component<MetaSectionProps> {
  renderName(user) {
    const lastName = get(user, ["personal", "lastName"], "");
    const firstName = get(user, ["personal", "firstName"], "");
    const middleName = get(user, ["personal", "middleName"], "");

    return `${lastName}${firstName ? ", " : " "}${firstName} ${middleName}`;
  }

  renderUser = (user) => {
    if (typeof user === "string" || isValidElement(user)) return user;

    const { showUserLink } = this.props;

    const name = this.renderName(user);

    if (showUserLink && user.id) {
      return (
        <Link to={`/users/view/${user.id}`} data-test-user-link>
          {name}
        </Link>
      );
    } else {
      return name;
    }
  };

  renderMetaSectionWithinAccordion = () => {
    const {
      createdBy,
      createdDate,
      headingLevel,
      hideSource,
      isLoading = false,
      lastUpdatedBy,
      lastUpdatedDate,
    } = this.props;

    const lastUpdatedByLabel = lastUpdatedBy ? (
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{ source: this.renderUser(lastUpdatedBy) }}
      />
    ) : (
      <FormattedMessage id="stripes-components.metaSection.sourceNoData" />
    );

    const createdLabel = createdDate ? (
      <FormattedMessage
        id="stripes-components.metaSection.recordCreated"
        values={{
          date: <FormattedDate value={createdDate} />,
          time: <FormattedTime value={createdDate} />,
        }}
      />
    ) : (
      <FormattedMessage id="stripes-components.metaSection.recordCreatedNoData" />
    );

    const createdByLabel = createdBy ? (
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{ source: this.renderUser(createdBy) }}
      />
    ) : (
      <FormattedMessage id="stripes-components.metaSection.sourceNoData" />
    );

    const lastUpdatedLabel = lastUpdatedDate ? (
      <FormattedMessage
        id="stripes-components.metaSection.recordLastUpdated"
        values={{
          date: <FormattedDate value={lastUpdatedDate} />,
          time: <FormattedTime value={lastUpdatedDate} />,
        }}
      />
    ) : (
      <FormattedMessage id="stripes-components.metaSection.recordLastUpdatedNoData" />
    );

    return (
      <Accordion
        header={MetaAccordionHeader}
        headerProps={{ headingLevel }}
        closedByDefault
        id={this.props.id}
        contentId={this.props.contentId}
        label={lastUpdatedLabel}
      >
        <div className={css.metaSectionContent}>
          {!hideSource && (
            <div className={css.metaSectionContentBlock} data-test-updated-by>
              {isLoading ? <Loading /> : lastUpdatedByLabel}
            </div>
          )}
          <div className={css.metaSectionGroup}>
            <div className={css.metaSectionContentBlock} data-test-created>
              {createdLabel}
            </div>
            {!hideSource && (
              <div className={css.metaSectionContentBlock} data-test-created-by>
                {isLoading ? <Loading /> : createdByLabel}
              </div>
            )}
          </div>
        </div>
      </Accordion>
    );
  };

  renderMetaSection = () => {
    const { hideSource, inlineLayout, lastUpdatedBy, lastUpdatedDate } =
      this.props;

    return (
      <div
        className={`${css.metaSectionContent} ${inlineLayout && css.metaSectionInline}`}
        data-test-meta-section-content
      >
        <div style={{ marginRight: "5px" }}>
          <FormattedMessage id="stripes-components.metaSection.lastUpdated" />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "5px" }}>
            <FormattedMessage
              id="stripes-components.metaSection.lastUpdatedDateTime"
              values={{
                date: <FormattedDate value={lastUpdatedDate} />,
                time: <FormattedTime value={lastUpdatedDate} />,
              }}
            />
          </div>
          <div data-test-updated-by>
            {!hideSource && (
              <FormattedMessage
                id="stripes-components.metaSection.lastUpdatedBy"
                values={{
                  source: lastUpdatedBy ? (
                    this.renderUser(lastUpdatedBy)
                  ) : (
                    <FormattedMessage id="stripes-components.metaSection.unknownUser" />
                  ),
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { noBackGround, useAccordion } = this.props;

    return (
      <div
        className={`${css.metaSectionRoot} ${!noBackGround && css.metaSectionRootBGColor}`}
        data-test-meta-section
      >
        {useAccordion
          ? this.renderMetaSectionWithinAccordion()
          : this.renderMetaSection()}
      </div>
    );
  }
}

MetaSection.defaultProps = defaultProps;

export default MetaSection;
