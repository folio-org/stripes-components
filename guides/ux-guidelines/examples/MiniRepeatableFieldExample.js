import React, { useState } from 'react';
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
      emptyMessage="No contributors yet."
      addLabel="Add contributor"
      fields={fields}
      onAdd={handleAdd}
      onRemove={handleRemove}
      renderField={() => <TextField label="Contributor" name="contributor" />}
    />
  );
}
