import React, { useRef, useState } from 'react';

import CommandList from '../CommandList';
import HasCommand from '../HasCommand';
import { defaultKeyboardShortcuts } from '../keyboardShortcuts';

const testShortcuts = defaultKeyboardShortcuts.filter((f) => f.name !== 'save');


const CommanderTestHarness = ({
  commands: testHandlers
}) => {
  const [formDirty, setFormDirty] = useState(false);
  const [testValue, setTestValue] = useState('');
  const innerRef = useRef();

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
    setFormDirty(true);
    setTestValue(e.target.value);
  };

  return (
    <CommandList
      id="test-ComList"
      commands={commands}
    >
      <div data-test-module-outer>
        <fieldset style={{ border: '1px solid #666', padding: '12px' }}>
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
            scope={innerRef}
          >
            <div data-test-module-inner ref={innerRef}>
              <fieldset style={{ border: '1px solid #600', padding: '12px' }}>
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

export default CommanderTestHarness;