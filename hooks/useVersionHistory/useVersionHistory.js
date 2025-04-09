import {
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * React hook for managing version history data and the "Load more" button visibility.
 *
 * @param {Array} data - Array of version history records to be processed.
 * @param {number} totalRecords - The total number of records available.
 * @param {Function} versionsFormatter - Optional formatter function for versions list.
 *
 * @returns {{versions: (*|*[]), isLoadMoreVisible: boolean}} Returns formatted list of versions
 * and a flag that indicates if the "Load More" button should be visible based on totalRecords value and a number of
 * displayed versions.
 */
const useVersionHistory = ({
  data,
  totalRecords,
  versionsFormatter,
}) => {
  const [versions, setVersions] = useState([]);

  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(true);

  // cleanup when component unmounts
  useEffect(() => () => {
    setVersions([]);
  }, []);

  useEffect(() => {
    if (!data?.length) return;

    setVersions(prevState => [...prevState, ...data]);
  }, [data]);

  useEffect(() => {
    setIsLoadMoreVisible(versions.length < totalRecords);
  }, [totalRecords, versions]);

  const versionsToDisplay = useMemo(
    () => (versionsFormatter ? versionsFormatter(versions) : versions),
    [versionsFormatter, versions]
  );

  return {
    versions: versionsToDisplay,
    isLoadMoreVisible,
  };
};

export default useVersionHistory;
