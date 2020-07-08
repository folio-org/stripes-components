import React, { cloneElement, useRef } from 'react';
import isBoolean from 'lodash/isBoolean';
import useRootClose from 'react-overlays/useRootClose';
import PropTypes from 'prop-types';
import separateComponentProps from '../../util/separateComponentProps';
import css from './DropdownMenu.css';

const propTypes = {
  bsClass: PropTypes.string,
  bsRole: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  labelledBy: PropTypes.string,
  minWidth: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectItem: PropTypes.func,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  overrideStyle: PropTypes.object,
  pullRight: PropTypes.bool,
  rootCloseEvent: PropTypes.string,
  width: PropTypes.string,
};

const defaultProps = {
  overrideStyle: {},
};

const DropdownMenu = props => {
  const {
    children,
    minWidth,
    onSelect,
    onSelectItem,
    onToggle,
    open,
    overrideStyle,
    pullRight,
    width
  } = props;

  const ref = useRef(null);

  useRootClose(ref, onToggle, {
    disabled: !open
  });

  const renderChildren = () => {
    // don't pass along props that we didn't receive. if the
    // onSelect stuff is empty, IGNORE IT. otherwise, you'll fill
    // up the console with warnings like this:
    // Unknown event handler property `onSelectItem`. It will be ignored.
    const selectHandlers = { };
    if (onSelectItem) {
      selectHandlers.onSelectItem = onSelectItem;
    }
    if (onSelect) {
      selectHandlers.onSelect = onSelect;
    }

    return React.Children.map(React.Children.toArray(children), (child) => {
      return cloneElement(child,
        Object.assign(
          {},
          child.props,
          selectHandlers,
        ),
        child.props.children);
    });
  };

  const [, ddprops] = separateComponentProps(props, propTypes);
  const openProp = isBoolean(open) ? open : true;
  const position = Object.assign({
    left: pullRight ? 'initial' : '0',
    display: openProp ? 'block' : 'none',
    right: pullRight ? '0' : 'initial',
    width: width || 'initial',
    minWidth: minWidth || null,
  }, overrideStyle);

  const menu = (
    <div className={css.DropdownMenu} style={position} {...ddprops} ref={ref}>
      {renderChildren()}
    </div>
  );

  if (open) {
    return menu;
  }

  return menu;
};

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default DropdownMenu;
