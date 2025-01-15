import React from 'react';
import { IntlContext } from 'react-intl';
import { loadDayJSLocale } from '../../util/dateTimeUtils';

const isEnglishLang = (locale) => {
  return /^en/.test(locale);
};

/**
* @typedef {Object} dynamicLocaleInfo
* @property {boolean} localeLoaded - whether the a new locale has loaded or not.
* @property {boolean} isEnglish - a boolean for whether or not the requested locale is English, DayJS' default, which is always loaded.
*/

/**
 * useDynamicLocale -
 * React hook that loads a DayJS locale.
 *
 * @returns {dynamicLocaleInfo}
 * @param {Object} hookParams
 * @param {String} hookParams.locale - locale string ex : 'en-SE'
 * @returns {dynamicLocaleInfo}
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
