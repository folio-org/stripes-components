// @ts-nocheck
import React from "react";
import classNames from "classnames";
import { camelCase } from "lodash";
import css from "./List.css";
type ListProps = {
  id?: string;
  isEmptyMessage?: string | React.ReactNode | React.ReactNode[];
  itemFormatter?: (...args: any[]) => any;
  items?: any[] | Record<string, any>;
  listClass?: string;
  listStyle?: "default" | "bullets";
  marginBottom0?: boolean;
};

const List = ({
  id,
  itemFormatter = (item, i) => <li key={i}>{item}</li>,
  listClass,
  marginBottom0 = false,
  listStyle = "default",
  items,
  isEmptyMessage,
}: ListProps) => {
  /**
   * Get list classes
   */
  const getListClass = () =>
    classNames(
      css.list,
      listClass,
      { [css.marginBottom0]: marginBottom0 },
      { [css[camelCase(`list style ${listStyle}`)]]: listStyle },
    );

  /**
   * Return empty message if we have one
   * and there is no visible items
   */
  if (!items.length && isEmptyMessage) {
    return <p className={css.isEmptyMessage}>{isEmptyMessage}</p>;
  }

  return (
    <ul className={getListClass()} id={id}>
      {items.map(itemFormatter, this)}
    </ul>
  );
};

export default List;
