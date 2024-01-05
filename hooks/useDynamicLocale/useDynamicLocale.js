import React from 'react';
import { dayjs } from '../../util/dateTimeUtils';
import availableLocales from 'dayjs/locale';
import { IntlContext } from 'react-intl';

const isEnglishLang = (locale) => {
  return /^en/.test(locale);
};

/**
 * getDayJSLocaleToLoad -
 * Function that returns an existing DayJS locale. Returns undefined if the static locale does not exist.
 *
 * @param {String} locale  - locale string ex : 'en-SE'
 * @param {String} parentLocale - 2 character language of the locale...ex parentLocale of
 */
const getDayJSLocaleToLoad = (locale, parentLanguage) => {
  /**
     * Check for availability of locales - DayJS comes with a JSON list of available locales.
     * We can check against that before attempting to load. We check for the full locale
     * first, followed by the language if the full locale doesn't work.
     */
  let localeToLoad;
  let available = availableLocales.findIndex(l => l.key === locale);
  if (available !== -1) {
    localeToLoad = locale;
  } else {
    available = availableLocales.findIndex(l => l.key === parentLanguage);
    if (available !== -1) {
      localeToLoad = parentLanguage;
    } else {
      // eslint-disable-next-line no-console
      console.error(`${locale}/${parentLanguage} unavailable for DayJS`);
    }
  }
  return localeToLoad;
};

/**
 * useDynamicLocale -
 * React hook that loads a DayJS locale, returns an
 * @date 12/15/2023 - 1:58:58 PM
 *
 * @param {Object} hookParams
 * @param {String} hookParams.locale - locale string ex : 'en-SE'
 */
const useDynamicLocale = ({ locale : localeProp } = {}) => {
  const { locale: localeContext } = React.useContext(IntlContext);
  const [localeLoaded, setLocaleLoaded] = React.useState(
    localeProp ? isEnglishLang(localeProp) :
      isEnglishLang(localeContext)
  );
  const [prevLocale, updatePrevLocale] = React.useState(localeProp || localeContext);
  const locale = localeProp || localeContext;

  React.useEffect(() => {
    const parentLanguage = locale.split('-')[0];
    const localeToLoad = getDayJSLocaleToLoad(locale, parentLanguage);
    // don't load a dynamic locale if the dayjs locale is already set to it,
    // or if it's already been loaded according to state...
    if (!localeLoaded && dayjs.locale() !== localeToLoad) {
      // check if locale is available
      const available = availableLocales.findIndex(l => l.key === localeToLoad);
      if (available !== -1) {
        import(
          /* webpackChunkName: "dayjs-locale-[request]" */
          /* webpackExclude: /\.d\.ts$/ */
          `dayjs/locale/${localeToLoad}`
        ).then(() => {
          dayjs.locale(localeToLoad);
          setLocaleLoaded(true);
        });
      }
    } else if (dayjs.locale() === localeToLoad) {
      setLocaleLoaded(true);
    } else if (localeToLoad === 'en') {
      setLocaleLoaded(true);
      dayjs.locale('en');
    }
  }, [localeLoaded, locale, prevLocale]);

  if (locale !== prevLocale) {
    updatePrevLocale(localeProp || localeContext);
    setLocaleLoaded(localeProp ? isEnglishLang(localeProp) : isEnglishLang(localeContext));
  }

  return {
    localeLoaded,
    isEnglish: localeProp ? localeProp === 'en' : localeContext === 'en'
  };
};

export default useDynamicLocale;
