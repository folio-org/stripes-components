/**
 * Calendar: Basic Usage
 */

import React, { useState } from 'react';
import Calendar from '../Calendar';
import TextField from '../../TextField';

const BasicUsage = () => {
  const [date, updateDate] = useState(null);


  return (
    <>
      <TextField label="Selected date from calendar below" readonly value={date} />
      <Calendar selectedDate={date} onSetDate={updateDate} />
    </>
  );
};

export default BasicUsage;
