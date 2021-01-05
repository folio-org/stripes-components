import React, { useState } from 'react';
import {
  CommandList,
  HasCommand,
  defaultKeyboardShortcuts,
} from '../../Commander';
import TextField from '../../TextField';
import Button from '../../Button';

export default () => {
  const [saveEnabled, updateSaveEnabled] = useState(false);

  const saveHandler = (e) => {
    e?.preventDefault(); // eslint-disable-line
    if (saveEnabled) {
      alert('data saved!'); // eslint-disable-line
      updateSaveEnabled(false);
    }
  };

  const formChange = () => {
    updateSaveEnabled(true);
  };

  const handlers = [
    {
      name: 'save',
      handler: saveHandler,
    }
  ];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <HasCommand commands={handlers}>
        <fieldset>
          <legend>Form Hotkeys</legend>
          <p>Ctrl + s is the save key when the form elements are focused...</p>
          <TextField onChange={formChange} label="Command field" />
          <Button disabled={!saveEnabled} onClick={saveHandler}>Save</Button>
        </fieldset>
      </HasCommand>
    </CommandList>
  );
};
