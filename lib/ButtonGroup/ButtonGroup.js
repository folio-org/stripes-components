import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './ButtonGroup.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  tagName: PropTypes.string,
};

const ButtonGroup = ({
  children,
  className,
  fullWidth = false,
  tagName: Tag = 'div',
  ...rest
}) => {
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

export default ButtonGroup;
