import { filters2cql } from '../lib/FilterGroups';

function makeQueryFunction(findAll, queryTemplate, sortMap, filterConfig) {
  return (queryParams, _pathComponents, _resourceValues, logger) => {
    const { query, filters } = queryParams || {};

    let cql = !query ? undefined : queryTemplate.replace(/\$QUERY/g, query);
    const filterCql = filters2cql(filterConfig, filters);
    if (filterCql) {
      if (cql) {
        cql = `(${cql}) and ${filterCql}`;
      } else {
        cql = filterCql;
      }
    }

    let { sort } = queryParams || {};
    if (sort) {
      let reverse = false;
      if (sort.startsWith('-')) {
        sort = sort.substr(1);
        reverse = true;
      }
      let sortIndex = sortMap[sort] || sort;
      if (reverse) {
        sortIndex = sortIndex.replace(' ', '/sort.descending ') + '/sort.descending';
      }
      if (cql === undefined) cql = findAll;
      cql += ` sortby ${sortIndex}`;
    }

    logger.log('mquery', `query='${query}' filters='${filters}' sort='${sort}' -> ${cql}`);
    return cql;
  };
}

export default makeQueryFunction;
