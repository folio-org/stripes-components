import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import TextField from '../TextField';

/**
 * Number
 * @param {*} param
 * @returns
 */
const NumberField = ({ field, ...rest }) => {
  const intl = useIntl();

  /**
   * The plot here is to take a number in native-js (12345.6),
   * collect its parts when pushed through Intl.NumberFormat,
   * and then use those parts to create a parser.
   *
   * It works for any locale, including those using non-Arabic
   * numerals (i.e. other than 0-9).
   *
   * verbatim from https://observablehq.com/@mbostock/localized-number-parsing
   */
  const parts = new Intl.NumberFormat(intl.locale).formatToParts(12345.6);
  const numerals = [...new Intl.NumberFormat(intl.locale, { useGrouping: false }).format(9876543210)].reverse();
  const index = new Map(numerals.map((d, i) => [d, i]));
  const nfGroup = new RegExp(`[${parts.find(d => d.type === 'group').value}]`, 'g');
  const nfDecimal = new RegExp(`[${parts.find(d => d.type === 'decimal').value}]`);
  const nfNumeral = new RegExp(`[${numerals.join('')}]`, 'g');
  const nfIndex = d => index.get(d);

  const parse = (v) => {
    return v.trim()
      .replace(nfGroup, '')
      .replace(nfDecimal, '.')
      .replace(nfNumeral, nfIndex)
      ? +v : NaN;
  };

  const format = (v) => {
    return intl.formatNumber(v);
  };

  const Field = field;

  return (
    <Field
      {...rest}
      component={TextField}
      parse={parse}
      format={format}
      type="numberasdfasdffffffffff"
    />);
};

NumberField.propTypes = {
  field: PropTypes.func
};

export default NumberField;
