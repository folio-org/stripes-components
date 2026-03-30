// @ts-nocheck
import React from "react";
import classNames from "classnames";

import css from "./DefaultPaneFooter.css";
type DefaultPaneFooterProps = {
  className?: string;
  renderEnd?: React.ReactNode | React.ReactNode[];
  renderStart?: React.ReactNode | React.ReactNode[];
};

const DefaultPaneFooter = ({
  renderStart,
  renderEnd,
  className,
}: DefaultPaneFooterProps) => (
  <div className={classNames(css.paneFooterContent, className)}>
    <span data-test-pane-footer-start className={css.renderStart}>
      {renderStart}
    </span>
    {renderEnd && <span data-test-pane-footer-end>{renderEnd}</span>}
  </div>
);

export default DefaultPaneFooter;
