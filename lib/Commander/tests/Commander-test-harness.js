import React, { useState } from 'react';

import CommandList from '../CommandList';
import HasCommand from '../HasCommand';
import { defaultKeyboardShortcuts } from '../keyboardShortcuts';

const testShortcuts = defaultKeyboardShortcuts.filter((f) => f.name !== 'save');


export default ({
  commands: testHandlers
}) => {
  const [formDirty, updateFormDirty] = useState(false);
  const [testValue, updateTestValue] = useState('');

  const testSaveHander = () => {
    testHandlers.save(formDirty);
  };

  const commands = [...testShortcuts,
    {
      name: 'save',
      label: 'save form',
      shortcut: 'mod + s',
      handler: testSaveHander
    },
  ];

  const handleFormChange = (e) => {
    updateFormDirty(true);
    updateTestValue(e.target.value);
  };

  return (
    <CommandList
      id="test-ComList"
      commands={commands}
    >
      <div data-test-module-outer>
        <fieldset style={{ border: '1px solid #666', padding:'12px' }}>
          <legend> Outer level</legend>
          <button type="button" data-test-focusable>Outer focusable (button)</button>
          <HasCommand
            id="test-HComm-inner"
            commands={[
              {
                name: 'new',
                handler: testHandlers.new
              },
              {
                name: 'save',
                handler: testSaveHander
              }
            ]}
          >
            <div data-test-module-inner>
              <fieldset style={{ border: '1px solid #600', padding:'12px' }}>
                <legend> Inner level (unscoped HasCommand)</legend>
                <input type="text" onChange={handleFormChange} value={testValue} />
                <button type="button" data-test-inner-focusable>Inner focusable (button)</button>
              </fieldset>
            </div>
          </HasCommand>
        </fieldset>
      </div>
    </CommandList>
  );
};
