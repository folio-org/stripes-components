import {
  useEffect,
  useMemo,
  useState,
} from 'react';

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
