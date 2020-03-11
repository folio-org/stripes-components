/**
 * Icon -> Available icons
 */

import React, { useState } from 'react';
import { select } from '@storybook/addon-knobs';
import Icon from '../Icon';
import TextField from '../../TextField';
import Highlighter from '../../Highlighter';
import EmptyMessage from '../../EmptyMessage';
import icons from '../icons';
import css from './style.css';

export default () => {
  const [query, setQuery] = useState('');
  const size = select('Size', { small: 'Small', medium: 'Medium', large: 'Large' }, 'large');
  const status = select('Status', { warn: 'Warning', error: 'Error', success: 'Success', none: 'None' }, 'none');
  const list = Object.keys(icons).filter(icon => !query || icon.includes(query.toLowerCase())).map((icon, i) => (
    <li className={css.iconGridItem} key={i}>
      <div className={css.iconGridItemInner}>
        <Icon
          size={size.toLowerCase()}
          icon={icon}
          status={status !== 'none' ? status.toLowerCase() : undefined}
        />
      </div>
      <p>
        <Highlighter
          searchWords={query ? [query] : []}
          text={icon}
        />
      </p>
    </li>
  ));

  return (
    <div>
      <TextField
        onChange={e => setQuery(e.target.value)}
        value={query}
        placeholder="Filter..."
      />
      {!list.length && <EmptyMessage>{`No icons that matches "${query}" was found`}</EmptyMessage>}
      <ul className={css.iconGrid}>
        { list }
      </ul>
    </div>
  );
};
