const defaultRowFormatter = (searchOption, query, comparator) => {
  return `${searchOption}${comparator}${query}`;
};

export default defaultRowFormatter;
