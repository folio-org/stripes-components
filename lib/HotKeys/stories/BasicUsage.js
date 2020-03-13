/**
 * HotKeys -> Basic usage
 */

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import TextField from '../../TextField';
import Button from '../../Button';
import MultiColumnList from '../../MultiColumnList';
import { HotKeys } from '..';

const outerOuterEnter = action('outer_outer_enter');
const outerInnerEnter = action('outer_inner_enter');
const innerOuterEnter = action('inner_outer_enter');
const innerInnerEnter = action('inner_inner_enter');


const tabOuterHandler = action('tabOuter');
const tabInnerHandler = action('tabInner');

const altOuterHandler = action('altOuter');
const altInnerHandler = action('altInner');

const outerDownHandler = action('downHandler');

const outerKeyMap = {
  'ENTER_OUTER': 'enter',
  'TAB': 'tab',
};

const innerKeyMap = {
  'ENTER_INNER': 'enter',
  'ALT': 'alt',
};

const outerHandlers = {
  'ENTER_OUTER': outerOuterEnter,
  'TAB': tabOuterHandler,
  'ENTER_INNER': outerInnerEnter,
  'ALT': altOuterHandler,
};

const innerHandlers = {
  'ENTER_OUTER': innerOuterEnter,
  'TAB': tabInnerHandler,
  'ENTER_INNER': innerInnerEnter,
  'ALT': altInnerHandler,
};

const alternativeOuterKey = {
  'TAB': 'down'
};

const alternativeOuterHandler = {
  'TAB': outerDownHandler
};

const hotkeyData = [
  { HotKey: 'alt', outerField: 'not mapped', innerField: 'altInner' },
  { HotKey: 'enter', outerField: 'outer_outer_enter', innerField: 'inner_inner_enter' },
  { HotKey: 'tab', outerField: 'tabOuter', innerField: 'tabInner' },
];

const BasicUsage = () => {
  const [value, setValue] = useState('fill');
  const [outerH, setOuterH] = useState(outerHandlers);
  const [outerK, setOuterK] = useState(outerKeyMap);

  const changeKey = () => {
    setOuterK(current => {
      return Object.assign({}, current, alternativeOuterKey);
    });
  };

  const changeHandler = () => {
    setOuterH(current => {
      return Object.assign({}, current, alternativeOuterHandler);
    });
  };

  /* eslint-disable max-len */
  return (
    <div>
      <h2>HotKeys</h2>
      <p>This table describes the mapping of the keyboard keys for the below example. In code, the tab key is mapped at the outside level, and the inner field applies its own handler. &quot;ALT&quot; is only mapped to the inner field. You can see output from pressing hot keys in the &quot;Action Logger&quot; panel below.</p>
      <MultiColumnList contentData={hotkeyData} />
      <p>
        The scope of a hotKey&apos;s affect in the UI is dictated by focus. When your focus indicator (blue outline in most browsers) is within the blue (outer) or orange (inner) borders, the scope is to the corresponding HotKeys instance.
      </p>
      <HotKeys keyMap={outerK} handlers={outerH} id="outer">
        <div style={{ border: '1px dashed blue', padding: '10px' }}>
          <TextField label="Outer field" value={value} onChange={(e) => { setValue(e.target.value); }} />
          <HotKeys keyMap={innerKeyMap} handlers={innerHandlers} id="inner">
            <div style={{ border: '1px dashed orange', padding: '10px'}}>
              <TextField label="Inner field" />
            </div>
          </HotKeys>
        </div>
      </HotKeys>
      <p>
        The buttons below will modify the mapped keys of the outer field. The &quot;Change Key&quot; button will map the &quot;Tab&quot; handler to the &quot;down&quot; arrow.
        The &quot;Change Handler&quot; button will map a &quot;downHandler&quot; to the &quot;Tab&quot; mapping.
      </p>
      <Button type="button" onClick={changeKey}>Change Tab key mapping to Down key</Button>
      <Button type="button" onClick={changeHandler}>Change Tab (or Down?) key handler to a Down key handler</Button>
    </div>
  );
};

/* eslint-enable max-len */
export default BasicUsage;
