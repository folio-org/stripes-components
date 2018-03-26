import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './SegmentedControl.css';
import Button from '../Button';
import createChainedFunction from '../../util/createChainedFunction';

const propTypes = {
  tag: PropTypes.string,
  activeId: PropTypes.string,
  onActivate: PropTypes.func, // eslint-disable-line
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
};

const defaultProps = {
  tag: 'nav',
};

const SegmentedControl = (props) => {
  const Tag = props.tag;

  const renderedChildren = React.Children.map(props.children, (child, i) => {
    if (child.type === Button) {
      const childDecoration = child.props.id === props.activeId ? 'primary noLRMargin' : 'noLRMargin default';
      let childRadius;
      const lastIndex = React.Children.count(props.children) - 1;
      if (i === 0) {
        if (i === lastIndex) {
          childRadius = ''; // if there's only one button in the nav, it just gets the standard radius.
        } else {
          childRadius = 'noRightRadius lastBorderOnly';
        }
      } else if (i === lastIndex) {
        childRadius = 'noLeftRadius';
      } else {
        childRadius = 'noRadius lastBorderOnly';
      }
      const childStyle = `${childDecoration} ${childRadius}`;
      const btn = React.cloneElement(
        child,
        Object.assign({}, child.props, {
          fullWidth: true,
          buttonStyle: childStyle,
          onClick: createChainedFunction(child.props.onClick, () => props.onActivate({ id: child.props.id })),
        }),
        child.props.children,
      );
      return (
        <div className={css.segment}>
          {btn}
        </div>
      );
    }

    return child;
  });

  return (
    <Tag className={classnames(css.segmentedControl, props.className)}>
      {renderedChildren}
    </Tag>
  );
};

SegmentedControl.propTypes = propTypes;
SegmentedControl.defaultProps = defaultProps;

export default SegmentedControl;
