import { filters2cql } from '../lib/FilterGroups';
import { compilePathTemplate } from '@folio/stripes-connect/RESTResource/RESTResource';

function makeQueryFunction(findAll, queryTemplate, sortMap, filterConfig, failIfNoQuery) {
  return (queryParams, pathComponents, resourceValues, logger) => {
    
    const { qindex, filters, query} = queryParams || {};

    if ((query === undefined || query === '') && failIfNoQuery) {
      return null;
    }

    //This check should remain in place until all uses of the $QUERY syntax have been removed from stripes modules
    if(queryTemplate.includes("$QUERY")) {
      logger.log('mquery', 'Use of "$QUERY" in the queryTemplate is deprecated. Use the "?{query}" syntax instead, as found https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#text-substitution')
      queryTemplate = queryTemplate.replace(/\$QUERY/g, '?{query}');
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
      cql = compilePathTemplate(queryTemplate, queryParams, pathComponents, resourceValues);
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
