import React from 'react';
import { IntlContext } from 'react-intl';
import { loadDayJSLocale } from '../../util/dateTimeUtils';

const isEnglishLang = (locale) => {
  return /^en/.test(locale);
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
    const localeCallback = (loadedLocale, err) => {
      if (!err) {
        setLocaleLoaded(true);
      }
    };

    loadDayJSLocale(locale, localeCallback);
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
