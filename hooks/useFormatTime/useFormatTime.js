import { useIntl } from 'react-intl';

import iso8601Timestamp from '../../util/iso8601Timestamp';

export const useFormatTime = () => {
  const intl = useIntl();

  return (time, options) => intl.formatTime(iso8601Timestamp(time), options);
};

export default useFormatTime;
