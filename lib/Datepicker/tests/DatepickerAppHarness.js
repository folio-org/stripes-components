/* a basic harness meant to set up scenarios for datepicker within an actual application
* where its props are fed to it by potentially dynamic sources.
*/
import React, { useState } from 'react';
import Datepicker from '../Datepicker';

const DatepickerAppHarness = ({
  lateValue = '04/01/2019',
  ...props
}) => {
  const [value, updateValue] = useState('');

  const setValue = () => {
    updateValue(lateValue);
  };

  return (
    <div>
      <div id="OverlayContainer" />
      <div id="AppContainer">
        <Datepicker value={value} {...props} />
        <button type="button" onClick={setValue} id="applylatevalue">set test value</button>
      </div>
    </div>
  );
};

export default DatepickerAppHarness;
