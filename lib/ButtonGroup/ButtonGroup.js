import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../Button';
import css from './ButtonGroup.css';

const propTypes = {
  children: (props) => {
    let error = null;
    React.Children.forEach(props.children, (child) => {
      if (child.type !== Button) {
        error = new Error('`ButtonGroup` children should be of type `Button`.');
      }
    });
    return error;
  },
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  tagName: PropTypes.string,
};

const defaultProps = {
  fullWidth: false,
  tagName: 'div'
};

const ButtonGroup = (props) => {
  const {
    children,
    className,
    fullWidth,
    tagName: Tag,
    ...rest
  } = props;

  return (
    <Tag
      className={
        classnames(
          css.buttonGroup,
          { [`${css.fullWidth}`]: fullWidth },
          className
        )
      }
      {...rest}
    >
      {children}
    </Tag>
  );
};

ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;

export default ButtonGroup;
