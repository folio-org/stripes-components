import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate as FD } from 'react-intl';
import iso8601Timestamp from '../util/iso8601Timestamp';

/**
 * Take a date-string formatted like
 *     2020-03-24T17:59:57.369+0000
 * and reformat it like
 *     2020-03-24T17:59:57.369+00:00
 * because ISO-8601 is ambiguous about the timezone format and the W3C, in
 * its infinite wisdom, thought that instead of handling the full slate
 * of formats it would be better to restrict the list of formats to a small
 * number. Sadly, so so sadly, our backend modules return timestamp strings
 * in the one ISO-8601 compliant format that the W3C decided not to implement,
 * so we have to tweak those values in order for react-intl to recognize them
 * and format them.
 *
 * It turns out that Chrome will usually handle timestamp strings without the
 * colon, but not on iOS. Ditto for Firefox. Safari always chokes on them.
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC
 * @see https://www.w3.org/TR/NOTE-datetime
 */
const FormattedDate = props => {
  const { value, ...rest } = props;
  const tweakedValue = iso8601Timestamp(value);
  return <FD value={tweakedValue} {...rest} />;
};

FormattedDate.propTypes = {
  value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default FormattedDate;
