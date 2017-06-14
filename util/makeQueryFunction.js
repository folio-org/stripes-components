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
      const sortIndexes = sort.split(',').map((sort1) => {
        let reverse = false;
        if (sort1.startsWith('-')) {
          sort1 = sort1.substr(1);
          reverse = true;
        }
        let sortIndex = sortMap[sort1] || sort1;
        if (reverse) {
          sortIndex = sortIndex.replace(' ', '/sort.descending ') + '/sort.descending';
        }
        return sortIndex;
      });

      if (cql === undefined) cql = findAll;
      cql += ` sortby ${sortIndexes.join(' ')}`;
    }

    logger.log('mquery', `query='${query}' filters='${filters}' sort='${sort}' -> ${cql}`);
    return cql;
  };
}

export default makeQueryFunction;
