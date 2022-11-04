import React from 'react';
import dayjs from 'dayjs';
import availabelLocales from 'dayjs/locale';
import IntlContext from 'react-intl';

export default () => {
  const { locale } = React.useContext(IntlContext);
  const [localeLoaded, setLocaleLoaded] = React.useState(locale === 'en');

  React.useEffect(() => {
    // don't load a dynamic locale if the dayjs locale is already set to it,
    // or if it's already been loaded according to state...
    if (!localeLoaded && dayjs.locale() !== locale) {
      // check if locale is available
      const available = availabelLocales.findIndex(l => l.key === locale);
      if (available !== -1) {
        import(/* webpackChunkName: "dayjs-locale-[request]" */ `dayjs/locale/${locale}`).then(() => {
          dayjs.locale(locale);
          setLocaleLoaded(true);
        });
      }
    }
  }, [localeLoaded, locale]);

  return { localeLoaded };
};
