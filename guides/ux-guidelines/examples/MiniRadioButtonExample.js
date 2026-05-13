import React, { useState } from 'react';
import RadioButton from '../../../lib/RadioButton';

export default function MiniRadioButtonExample() {
  const [selected, setSelected] = useState('title');

  return (
    <fieldset>
      <RadioButton
        name="mini-radio-example"
        label="Title"
        value="title"
        checked={selected === 'title'}
        onChange={() => setSelected('title')}
      />
      <RadioButton
        name="mini-radio-example"
        label="Identifier"
        value="identifier"
        checked={selected === 'identifier'}
        onChange={() => setSelected('identifier')}
      />
    </fieldset>
  );
}
