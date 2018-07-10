import { isString, isObject, mapKeys, mapValues, transform } from 'lodash';

// the list of allowed parameters to which the namespace will be added
const PARAM_WHITELIST = { filters: 1, query: 1, sort: 1, qindex: 1 };

export function getNsKey(key, params) {
  if (!params || !PARAM_WHITELIST[key]) return key;
  return (isString(params)) ? `${params}.${key}` : (params[key] || key);
}

// Adds namespace / prefix to keys in whitelist for given values object
//
// example:
// values = { query: "test", filters: 'active', userId: 1 }, params = 'users'
// result:
// { "users.query" : "test", "users.filters": "active", userId: 1 }
export function mapNsKeys(values, params) {
  if (!params) return values;
  return mapKeys(values, (value, key) => getNsKey(key, params));
}

// Removes namespace / prefix from keys for given values object
//
// example:
// values = { "users.query" : "test", "users.filters": "active" }, params = 'users'
// result:
// { query: "test", filters: 'active' }
export function removeNsKeys(values, params) {
  if (!params) return values;

  if (isObject(params)) {
    return mapValues(params, value => values[value]);
  }

  if (isString(params)) {
    const prefix = new RegExp(`^${params}\\.`, 'i');
    return transform(values, (result, value, key) => {
      if (key.match(prefix)) {
        result[key.replace(prefix, '')] = value;
      }
      return result;
    }, {});
  }

  return values;
}
