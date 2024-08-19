/* a basic harness meant to set up scenarios for datepicker within an actual application
* where its props are fed to it by potentially dynamic sources within a stateful structure.
*/
import React, { useState } from 'react';
import Datepicker from '../Datepicker';

const DatepickerAppHarness = ({
  children,
  lateValue = '04/01/2019',
  ...props
}) => {
  const [value, updateValue] = useState('');

  const setValue = () => {
    updateValue(lateValue);
  };

  const internalOnchange = (...args) => {
    if (props.onChange) props.onChange(args[1]);
    updateValue(args[1]);
  };

  return (
    <div>
      <div id="OverlayContainer" />
      <div id="AppContainer">
        { children ? children({
          value,
          ...props,
          onChange: internalOnchange,
        }) : (
          <Datepicker
            value={value}
            {...props}
            onChange={internalOnchange}
          />)
        }
        <button type="button" onClick={setValue} id="applylatevalue">set test value</button>
        <div><span>value:</span>{value}</div>
      </div>
    </div>
  );
};

export default DatepickerAppHarness;
