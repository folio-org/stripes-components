// @ts-nocheck
import React from "react";
import createChainedFunction from "../../util/createChainedFunction";
type MenuItemProps = {
  children?: string | React.ReactNode[] | React.ReactNode;
  itemMeta?: any;
  onSelectItem: (...args: any[]) => any;
};

const MenuItem = (props: MenuItemProps) => {
  const handleItemSelect = (e) => {
    props.onSelectItem(props.itemMeta, e);
  };

  const collectClickHandlers = (child) => {
    if (child.props) {
      return createChainedFunction(child.props.onClick, handleItemSelect);
    }
    return handleItemSelect;
  };

  const renderChildren = () =>
    React.Children.map(props.children, (child) =>
      React.cloneElement(
        child,
        Object.assign({}, child.props, {
          onClick: collectClickHandlers(child),
        }),
        child.props.children,
      ),
    );

  return <div>{renderChildren()}</div>;
};

export default MenuItem;
