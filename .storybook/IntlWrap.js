// component providing both a switch for locale and a toggle switch for rtl.
import React, { useState, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import css from './IntlWrap.css';

function updatePageDirection(direction) {
  document.body.dir = direction;
  console.log('setting direction');
}

const IntlWrap = ({ messages, children }) => {
  const [locale, updateLocale] = useState('en');
  const [direction, updateDirection ] = useState('LTR');

  const handleDirectionChange = (e) => {
    updateDirection(e.target.value);
    updatePageDirection(e.target.value);
  };

  return (
    <IntlProvider locale={locale} messages={messages['en']}>
      <div className={css.iwControls} dir="ltr"><label className={css.iwLabel}>Locale: </label><select value={locale} onChange={e => updateLocale(e.target.value)}>
        {
          Object.keys(messages).map(l => <option key={l}>{l}</option>)
        }
        </select>
        <div className={css.iwFieldSet}>
          <label className={`${css.iwLegend} ${css.iwLabel}`} >Direction: </label>
          <label><input type="radio" onChange={handleDirectionChange} name="direction" value="LTR" checked={direction === 'LTR'}/> LTR</label>
          <label><input type="radio" onChange={handleDirectionChange} name="direction" value="RTL" checked={direction === 'RTL'}/> RTL</label>
        </div>
      </div>
      { children }
    </IntlProvider>
  )
}

export default IntlWrap;
