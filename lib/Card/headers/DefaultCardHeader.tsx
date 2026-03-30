// @ts-nocheck
import React from "react";
import className from "classnames";

import css from "./DefaultCardHeader.css";
type DefaultCardHeaderProps = {
  cardStyle?: "default" | "negative" | "positive";
  headerClass?: string;
  headerEnd?: React.ReactNode | React.ReactNode[];
  headerProps?: Record<string, any>;
  headerStart: React.ReactNode | React.ReactNode[];
};

export default class DefaultCardHeader extends React.Component<DefaultCardHeaderProps> {
  static defaultProps = {
    headerProps: {},
  };

  getHeaderStyle = () => {
    return className(
      css.header,
      css[this.props.cardStyle],
      this.props.headerClass,
    );
  };

  render() {
    const { headerEnd, headerProps, headerStart } = this.props;

    return (
      <div
        className={this.getHeaderStyle()}
        data-test-card-header
        {...headerProps}
      >
        <span className={css.headerStart} data-test-card-header-start>
          {headerStart}
        </span>
        {headerEnd && <span data-test-card-header-end>{headerEnd}</span>}
      </div>
    );
  }
}
