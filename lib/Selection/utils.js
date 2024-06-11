import isEqual from 'lodash/isEqual';

/* filterOptionList
 *   conforms to shapes of options.
 *   standard options are { value, label }
 *   grouped options are { label, options } where options contains standard options.
 */
export const filterOptionList = (value, dataOptions) => {
  const valueRE = new RegExp(`^${value}`, 'i');
  const baseFilter = (o) => valueRE.test(o.label);
  // if items have an 'options' field, filter those items and return the dataOptions group with the
  // results inserted.
  const grouped = dataOptions.some((o) => Object.prototype.hasOwnProperty.call(o, 'options'));
  if (grouped) {
    return dataOptions.reduce((options, opt) => {
      // global, ungrouped options
      if (Object.prototype.hasOwnProperty.call(opt, 'value')) {
        if (valueRE.test(opt.label)) {
          return [...options, opt];
        }
      } else if (Object.prototype.hasOwnProperty.call(opt, 'options')) {
        const filteredOptions = opt.options.filter(baseFilter);
        if (filteredOptions.length > 0) {
          return [...options, { ...opt, options: filteredOptions }];
        }
      }
      return options;
    }, []);
  }
  return dataOptions.filter(baseFilter);
};

export const flattenOptionList = (dataOptions) => {
  return dataOptions
    ? dataOptions.flatMap((opt) => {
      // global, ungrouped options
      if (Object.prototype.hasOwnProperty.call(opt, 'value')) {
        return opt;
      } else if (Object.prototype.hasOwnProperty.call(opt, 'options')) {
        const { label, options } = opt;
        return [{ label }, ...options];
      }
      return undefined;
    })
    : [];
};

// find the value object from dataOptions
export const getSelectedObject = (value, dataOptions = []) => {
  if (dataOptions.length > 0) {
    if (typeof value !== 'undefined') {
      const flattenedOptions = flattenOptionList(dataOptions);
      // in the case of RF, nothing selected, so cursor the 1st...
      const valueIndex = flattenedOptions.findIndex((o) => o.value === value);
      return flattenedOptions[valueIndex];
    }
  }
  return undefined;
};

/** ensureValuedOption
 * returns an option object that contains a 'value' field or
 * recurses to the next index.
 */
export const ensureValuedOption = (index, dataOptions) => {
  if (dataOptions[index]) {
    if (Object.prototype.hasOwnProperty.call(dataOptions[index], 'value')) {
      return dataOptions[index];
    }
    return ensureValuedOption(index + 1, dataOptions);
  }
  return undefined;
};

export const defaultItemToString = (item) => item?.label;

// removes any option group headers, leaving only selectable options.
export const reduceOptions = (dataOptions) => dataOptions?.reduce((options, op) => {
  if (op.value) options.push(op);
  if (op.options) return [...options, ...op.options];
  return options;
}, []);

// reconcile index of rendered item to items that are only selectable.
export const reconcileReducedIndex = (item, items) => {
  return items.findIndex((i) => isEqual(i, item));
};
