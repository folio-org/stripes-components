/**
 * Text Field Icon
 */
import React from 'react';
import PropTypes from 'prop-types';
import css from './TextField.css';
import Icon from '../Icon';
import IconButton from '../IconButton';

const TextFieldIcon = ({ onClick, title, icon, iconClassName, onMouseDown, tabIndex, id, iconSize }) => (
  <div className={css.textFieldIcon}>
    { (typeof onClick === 'function' || typeof onMouseDown === 'function') ? (
      <IconButton
        title={title}
        onClick={onClick}
        onMouseDown={onMouseDown}
        tabIndex={tabIndex}
        icon={icon}
        size="small"
        id={id}
        iconClassName={iconClassName}
      />
    ) : <Icon id={id} icon={icon} size={iconSize} iconClassName={iconClassName} />}
  </div>
);

TextFieldIcon.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.string,
  onMouseDown: PropTypes.func,
  tabIndex: PropTypes.string,
};

TextFieldIcon.defaultProps = {
  iconSize: 'medium',
};

export default TextFieldIcon;
