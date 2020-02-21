/**
 * Highlighter -> Basic usage
 */

import React, { useState } from 'react';
import TextField from '../../TextField';
import Highlighter from '../Highlighter';

const BasicUsage = () => {
  const [value, setValue] = useState('walking water specification frozen');
  const searchWords = value ? value.split(' ') : [];

  return (
    <div>
      <TextField
        label="Text to highlight"
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <Highlighter
        searchWords={searchWords}
        text="“Walking on water and developing software from a specification are easy if both are frozen.”"
      />
      <Highlighter
        style={{ marginTop: 10, display: 'block' }}
        searchWords={searchWords}
        text="– Edward V. Berard"
      />
    </div>
  );
};

export default BasicUsage;
