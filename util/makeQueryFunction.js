import { filters2cql } from '../lib/FilterGroups';
import { compilePathTemplate } from '@folio/stripes-connect/RESTResource/RESTResource';

// failOnCondition can take values:
//      0: do not fail even if query and filters and empty
//      1: fail if query is empty, whatever the filter state
//      2: fail if both query and filters and empty.
//
// For compatibility, false and true may be used for 0 and 1 respectively.
//
function makeQueryFunction(findAll, queryTemplate, sortMap, filterConfig, failOnCondition) {
  return (queryParams, pathComponents, resourceValues, logger) => {

    const { qindex, filters, query, sort } = resourceValues.query || {};

    if ((query === undefined || query === '') &&
        (failOnCondition === 1 || failOnCondition === true)) {
      return null;
    }
    if ((query === undefined || query === '') &&
        (filters === undefined || filters === '') &&
        (failOnCondition === 2)) {
      return null;
    }

    //This check should remain in place until all uses of the $QUERY syntax have been removed from stripes modules
    if (queryTemplate.includes("$QUERY")) {
      console.warn('Use of "$QUERY" in the queryTemplate is deprecated. Use the "%{query.query}" syntax instead, as found at https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#text-substitution')
      queryTemplate = queryTemplate.replace(/\$QUERY/g, '?{query}');
    }

    let cql = undefined;
    if (query && qindex) {
      const t = qindex.split('/', 2);
      if (t.length === 1) {
        cql = `${qindex}="${query}*"`;
      } else {
        cql = `${t[0]} =\/${t[1]} "${query}*"`;
      }
    } else if (query) {
      cql = compilePathTemplate(queryTemplate, queryParams, pathComponents, resourceValues);
      if (cql === null) {
        // Some part of the template requires something that we don't have.
        return null;
      }
    }

    const filterCql = filters2cql(filterConfig, filters);
    if (filterCql) {
      if (cql) {
        cql = `(${cql}) and ${filterCql}`;
      } else {
        cql = filterCql;
      }
    }

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
      cql = `(${cql}) sortby ${sortIndexes.join(' ')}`;
    }

    logger.log('mquery', `query='${query}' filters='${filters}' sort='${sort}' -> ${cql}`);

    return cql;
  };
}

export default makeQueryFunction;
