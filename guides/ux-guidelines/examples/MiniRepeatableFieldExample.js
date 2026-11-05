import React, { useState } from 'react';
import Label from '../../../lib/Label';
import RepeatableField from '../../../lib/RepeatableField';
import TextField from '../../../lib/TextField';

export default function MiniRepeatableFieldExample() {
  const [fields, setFields] = useState([]);

  const handleAdd = () => {
    setFields((prev) => prev.concat({}));
  };

  const handleRemove = (index) => {
    setFields((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  return (
    <RepeatableField
      id="mini-repeatable-field"
      legend="Contributors"
      addLabel="Add contributor"
      fields={fields}
      onAdd={handleAdd}
      onRemove={handleRemove}
      hasRemoveButtonMargin={false}
      renderField={() => (
        <TextField
          aria-labelledby="mini-contributor-label"
          name="contributor"
        />
      )}
    />
  );
}
