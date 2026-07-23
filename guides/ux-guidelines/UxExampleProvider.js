import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import enTranslations from '../../translations/stripes-components/en.json';

function prefixKeys(obj) {
  const res = {};
  for (const key of Object.keys(obj)) {
    res[`stripes-components.${key}`] = obj[key];
  }

  return res;
}

const messages = prefixKeys(enTranslations);

export default function UxExampleProvider({ children }) {
  useEffect(() => {
    const name = 'OverlayContainer';
    if (!document.getElementById(name)) {
      const overlayContainerEl = document.createElement('div');
      overlayContainerEl.id = name;
      document.body.appendChild(overlayContainerEl);
    }
  }, []);

  return (
    <IntlProvider locale="en" messages={messages}>
      <div className="ux-example-sandbox">
        {children}
      </div>
    </IntlProvider>
  );
}
