/**
 * Icon Story: Basic Usage
 */

import React from 'react';
import { select, color } from '@storybook/addon-knobs';
import Icon from '../Icon';
import icons from '../icons';
import css from './style.css';

export default () => {
  const size = select('Size', { small: 'Small', medium: 'Medium', large: 'Large' }, 'large');
  const colour = color('Color', '#999');
  const list = Object.keys(icons).map((icon, i) => (
    <li className={css.iconGridItem} key={i}>
      <div className={css.iconGridItemInner}>
        <Icon
          size={size}
          icon={icon}
          color={colour}
        />
      </div>
      <p>{icon}</p>
    </li>
  ));

  return (
    <div style={{ padding: '15px' }}>
      <ul className={css.iconGrid}>
        { list }
      </ul>
      <Icon icon="lol" />
    </div>
  );
};
