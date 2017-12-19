/**
 * Text Field Icon
 */
import React from 'react';
import css from './TextField.css';
import Icon from '../Icon';
import Button from '../Button';
import IconButton from '../IconButton';

const TextFieldIcon = ({ onClick, title, icon, iconClassName, onMouseDown, tabIndex, iconSize }) => (
  <div className={css.textFieldIcon}>
    { typeof onClick === 'function' ? (
      <IconButton
        title={title}
        onClick={onClick}
        onMouseDown={onMouseDown}
        tabIndex={tabIndex}
        icon={icon}
        size="small"
        iconClassName={iconClassName}
      />
    ) : <Icon icon={icon} iconClassName={iconClassName} size={iconSize} />}
  </div>
);

export default TextFieldIcon;
