/**
 * Text Field Icon
 */
import React from 'react';
import PropTypes from 'prop-types';
import css from './TextField.css';
import Button from '../Button';
import Icon from '../Icon';

const TextFieldIcon = ({ onClick, icon, iconClassName, onMouseDown, tabIndex, id, iconSize }) => (
  <div className={css.textFieldIcon}>
    { (typeof onClick === 'function' || typeof onMouseDown === 'function') ? (
      <Button
        id={id}
        buttonStyle="plain slim"
        onClick={onClick}
        onMouseDown={onMouseDown}
        tabIndex={tabIndex}
      >
        <Icon icon={icon} />
      </Button>
    ) : <Icon id={id} icon={icon} size={iconSize} iconClassName={iconClassName} />}
  </div>
);

TextFieldIcon.propTypes = {
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  tabIndex: PropTypes.string,
};

TextFieldIcon.defaultProps = {
  iconSize: 'medium',
};

export default TextFieldIcon;
