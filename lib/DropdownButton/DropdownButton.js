import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { Dropdown } from '../Dropdown';
import Button from '../Button';
import DropdownMenu from '../DropdownMenu';
import Icon from '../Icon';

import omit from '../../util/omitProps';

import css from './DropdownButton.css';

export default class DropdownButton extends React.Component {
  /* eslint-disable react/sort-prop-types */
  static propTypes = {
    buttonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    align: PropTypes.string,
    buttonClass: PropTypes.string,
    buttonStyle: PropTypes.string,
    fullWidth: PropTypes.bool,
    marginBottom0: PropTypes.bool,
    paddingSide0: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dropdownClass: PropTypes.string,
    hasPadding: PropTypes.bool,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onSelect: PropTypes.func,
    onSelectItem: PropTypes.func,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    pullRight: PropTypes.bool,
    tag: PropTypes.string,
    tether: PropTypes.object,
    bsClass: PropTypes.string,
    bsRole: PropTypes.string,
    labelledBy: PropTypes.string,
    minWidth: PropTypes.string,
    width: PropTypes.string,
    onClose: PropTypes.func,
    overrideStyle: PropTypes.object,
    rootCloseEvent: PropTypes.string,
  };

  renderButton() {
    const unnededProps = [
      'className',
      'disabled',
      'dropdownClass',
      'hasPadding',
      'id',
      'onSelect',
      'onSelectItem',
      'onToggle',
      'open',
      'pullRight',
      'tag',
      'tether',
      'bsClass',
      'bsRole',
      'children',
      'labelledBy',
      'minWidth',
      'onClose',
      'onSelect',
      'onSelectItem',
      'overrideStyle',
      'rootCloseEvent',
      'width',
    ];

    const {
      buttonContent,
      buttonClass,
      ...otherButtonProps
    } = omit(this.props, unnededProps);

    const buttonClasses = classNames(
      css.dropdownButton,
      buttonClass,
    );

    return (
      <Button
        data-role="toggle"
        buttonClass={buttonClasses}
        {...otherButtonProps}
      >
        <span className={css.dropdownButton__content}>
          {buttonContent}
        </span>
        {this.renderTriangleIcon()}
      </Button>
    );
  }


  renderTriangleIcon() {
    const iconType = this.props.open
      ? 'triangle-up'
      : 'triangle-down';

    return (
      <Icon
        icon={iconType}
        size="small"
        className={css.dropdownButton__icon}
      />
    );
  }

  renderDropdownMenu() {
    const unnededProps = [
      'buttonContent',
      'align',
      'marginBottom0',
      'padingSide0',
      'buttonClass',
      'buttonStyle',
      'fullWidth',
      'role',
      'type',
      'className',
      'disabled',
      'dropdownClass',
      'hasPadding',
      'id',
      'onSelect',
      'onSelectItem',
      'onToggle',
      'open',
      'pullRight',
      'tag',
      'teher',
    ];

    const {
      children: dropdownContent,
      ...otherDropdownMenuProps
    } = omit(this.props, unnededProps);

    return (
      <DropdownMenu
        data-role="menu"
        {...otherDropdownMenuProps}
      >
        {dropdownContent}
      </DropdownMenu>
    );
  }

  render() {
    const unnededProps = [
      'buttonContent',
      'align',
      'marginBottom0',
      'buttonClass',
      'buttonStyle',
      'fullWidth',
      'marginBottom0',
      'paddingSide0',
      'ref',
      'bsClass',
      'bsRole',
      'minWidth',
      'onClose',
      'onSelect',
      'overrideStyle',
      'rootCloseEvent',
      'width',
    ];

    const drowdownProps = omit(this.props, unnededProps);

    return (
      <Dropdown
        {...drowdownProps}
      >
        {this.renderButton()}
        {this.renderDropdownMenu()}
      </Dropdown>
    );
  }
}
