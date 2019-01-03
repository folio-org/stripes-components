import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ButtonGroup from '../ButtonGroup';
import css from './SegmentedControl.css';
import createChainedFunction from '../../util/createChainedFunction';

const propTypes = {
  activeId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
  onActivate: PropTypes.func,
  tag: PropTypes.string,
};

const defaultProps = {
  tag: 'nav',
};

const SegmentedControl = ({
  activeId,
  children,
  className,
  onActivate,
  tag: Tag,
}) => {
  console.warn('<SegmentedControl> is deprecated. Instead use <ButtonGroup> instead.');

  const renderedChildren = React.Children.map(children, (child) => {
    const childDecoration = child.props.id === activeId ? 'primary' : 'default';
    const childStyle = `${childDecoration}`;
    const btn = React.cloneElement(
      child,
      Object.assign({}, child.props, {
        buttonStyle: childStyle,
        onClick: createChainedFunction(child.props.onClick, () => onActivate({ id: child.props.id })),
      }),
      child.props.children,
    );
    return btn;
  });

  return (
    <Tag className={classnames(css.segmentedControl, className)}>
      <ButtonGroup fullWidth>
        {renderedChildren}
      </ButtonGroup>
    </Tag>
  );
};

SegmentedControl.propTypes = propTypes;
SegmentedControl.defaultProps = defaultProps;

export default SegmentedControl;
