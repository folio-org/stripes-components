// @ts-nocheck
import React from "react";

import Button from "../Button";
import Icon from "../Icon";

import css from "./LayoutHeader.css";
type LayoutHeaderProps = {
  actions?: {
    handler?: (...args: any[]) => any;
    icon?: string;
    title?: string | React.ReactNode;
  }[];
  level?: number;
  noActions?: boolean;
  onDelete?: (...args: any[]) => any;
  title?: string | React.ReactNode;
};

const LayoutHeader = ({
  title,
  level = 3,
  actions,
  onDelete,
  noActions,
}: LayoutHeaderProps) => {
  const getHeader = () =>
    React.createElement(`h${level}`, { style: { margin: 0 } }, title);

  const renderActions = () => {
    const renderedActions = [];
    if (noActions) {
      return [<span key={`${title.toString()}-noAction`}>&nbsp;</span>];
    }

    let actionList;
    if (!actions) {
      actionList = [
        {
          title: "Delete",
          icon: "trash",
          handler: onDelete,
        },
      ];
    } else {
      actionList = actions;
    }

    actionList.forEach((a, i) => {
      renderedActions.push(
        <Button
          key={`${a.title}-${i}`}
          buttonStyle="link slim"
          style={{ margin: 0, padding: 0 }}
          onClick={a.handler}
        >
          <Icon icon={a.icon} width="24px" height="24px" />{" "}
          <span className="sr-only">{a.title}</span>
        </Button>,
      );
    });
    return renderedActions;
  };

  return (
    <div className={css.sectionHeader}>
      <div>{getHeader()}</div>
      <div className={css.sectionActions}>{renderActions()}</div>
    </div>
  );
};

export default LayoutHeader;
