import { filters2cql } from '../lib/FilterGroups';

function makePathFunction(basePath, findAll, queryTemplate, sortMap, filterConfig) {
  console.warn(
    '\nWarning: makePathFunction() is deprecated and will be removed in the\n' +
      'next major version of @folio/stripes-components.\n\n' +
      'Instead, use makeQueryFunction() from @folio/stripes-smart-components.\n'
  );

  return (queryParams, _pathComponents, _resourceValues, logger) => {
    const { query, filters, sort } = queryParams || {};

    let cql = !query ? undefined : queryTemplate.replace(/\$QUERY/g, query);
    const filterCql = filters2cql(filterConfig, filters);
    if (filterCql) {
      if (cql) {
        cql = `(${cql}) and ${filterCql}`;
      } else {
        cql = filterCql;
      }
    }

    if (sort) {
      const sortIndex = sortMap[sort] || sort;
      if (cql === undefined) cql = findAll;
      cql += ` sortby ${sortIndex}`;
    }

    let path = basePath;
    if (cql) path += `?query=${encodeURIComponent(cql)}`;

    logger.log('mpath', `query='${query}' filters='${filters}' sort='${sort}' -> ${path}`);
    return path;
  };
}

export default makePathFunction;
