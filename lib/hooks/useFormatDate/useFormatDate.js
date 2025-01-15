import { useIntl } from 'react-intl';

import iso8601Timestamp from '../../util/iso8601Timestamp';

const useFormatDate = () => {
  const intl = useIntl();

  return date => intl.formatDate(iso8601Timestamp(date));
};

export default useFormatDate;
