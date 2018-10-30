/**
 * Icon Story: Basic Usage
 */

import React from 'react';
import { select } from '@storybook/addon-knobs';
import Icon from '../Icon';
import icons from '../icons';
import css from './style.css';

export default () => {
  const size = select('Size', { small: 'Small', medium: 'Medium', large: 'Large' }, 'large');
  const status = select('Status', { warn: 'Warning', error: 'Error', success: 'Success', none: 'None' }, 'none');
  const list = Object.keys(icons).map((icon, i) => (
    <li className={css.iconGridItem} key={i}>
      <div className={css.iconGridItemInner}>
        <Icon
          size={size}
          icon={icon}
          status={status !== 'none' ? status : undefined}
        />
      </div>
      <p>{icon}</p>
    </li>
  ));

  return (
    <div>
      <ul className={css.iconGrid}>
        { list }
      </ul>
    </div>
  );
};
