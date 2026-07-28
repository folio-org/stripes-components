/**
 * HotKeysHarness - used for testing conditions for rendering within a stateful component.
 */

import React, { useRef, useState } from 'react';
import HotKeys from '../HotKeys';

const HotKeysHarness = ({
  outerHandlers,
  outerKeyMap,
  innerHandlers,
  innerKeyMap,
  innerTestId,
  outerTestId,
  alternativeOuterHandler,
  alternativeOuterKey,
}) => {
  const [value, setValue] = useState('fill');
  const [outerH, setOuterH] = useState(outerHandlers);
  const [outerK, setOuterK] = useState(outerKeyMap);
  const outerRef = useRef();
  const innerRef = useRef();

  const changeKey = () => {
    setOuterK(current => {
      return { ...current, ...alternativeOuterKey };
    });
  };

  const changeHandler = () => {
    setOuterH(current => {
      return { ...current, ...alternativeOuterHandler };
    });
  };

  return (
    <div>
      <button type="button" onClick={changeKey}>Change Key</button>
      <button type="button" onClick={changeHandler}>Change Handler</button>
      <HotKeys keyMap={outerK} handlers={outerH} id="outer" attach={outerRef}>
        <input aria-label={outerTestId} value={value} onChange={(e) => { setValue(e.target.value); }} ref={outerRef} />
        <HotKeys keyMap={innerKeyMap} handlers={innerHandlers} id="inner" attach={innerRef}>
          <input aria-label={innerTestId} ref={innerRef} />
        </HotKeys>
      </HotKeys>
    </div>
  );
};

export default HotKeysHarness;
