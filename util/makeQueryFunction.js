import { filters2cql } from '../lib/FilterGroups';

function makeQueryFunction(findAll, queryTemplate, sortMap, filterConfig, failIfNoQuery) {
  return (queryParams, _pathComponents, _resourceValues, logger) => {
    const { qindex, query, filters } = queryParams || {};

    if ((query === undefined || query === '') && failIfNoQuery) {
      return null;
    }

    let cql = undefined;
    if (query && qindex) {
      const t = qindex.split('/', 2);
      if (t.length === 1) {
        cql = `${qindex}="${query}*"`;
      } else {
        cql = `${t[0]} =/${t[1]} "${query}*"`;
      }
    } else if (query) {
      cql = queryTemplate.replace(/\$QUERY/g, query);
    }
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
