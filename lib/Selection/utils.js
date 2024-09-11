import { useEffect, useState, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export function asyncProcessChunk(array, fn, chunksize = 100, context = window) {
  return new Promise((resolve) => {
    let index = 0;
    const res = [];
    if (array.length === 0) {
      resolve(res);
      return;
    }
    // const numSlices = Math.ceil(array.length / chunksize);
    function doChunk() {
      let end = index + chunksize;
      if (end > array.length) {
        end = Math.max(array.length - 1, 1);
      }
      const items = array.slice(index, end);
      // callback called with args (array)
      res.push(...fn.call(context, items));
      index += chunksize;
      if (index < array.length) {
        // set Timeout for async iteration
        setTimeout(doChunk, 1);
      } else {
        resolve(res);
      }
    }
    doChunk();
  });
}

export const useProcessedData = (
  data,                                     // input data to process.
  fn,                                       // processing function. Return values are collected in result
  onComplete = () => {},                    // take further action when processing is complete.
  shouldProcess = () => (data.length > 0),  // should the data be processed or pass empty result?
  shouldPass = () => false                  // should just pass data through, unprocessed...
) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const busy = useRef(false);
  const shouldProcessConst = shouldProcess();
  const shouldPassConstant = shouldPass();
  useEffect(() => {
    busy.current = true;
    if (data.length === 0) return undefined;
    const processData = async () => {
      setResult([]);
      try {
        if (!busy.current) { return; } // avoid race condition between calls.
        const processed = await asyncProcessChunk(data, fn);
        setResult(processed);
      } catch (error) {
        console.error(`useProcessedData: ${error.message}, shouldProcess: ${shouldProcess}, fn: ${fn}`);
      } finally {
        setLoading(false);
        onComplete();
      }
    }

    if (shouldProcessConst) {
      if (!loading) {
        if (!shouldPassConstant) {
          setLoading(true)
          processData();
        } else {
          setResult(data);
        }
      }
    } else {
      setResult([])
    }

    return () => {
      busy.current = false;
      setLoading(false);
    }
  }, [data, fn])

  return {
    loading,
    result
  };
}

/* filterOptionList
 *   conforms to shapes of options.
 *   standard options are { value, label }
 *   grouped options are { label, options } where options contains standard options.
 */
export const filterOptionList = (value, dataOptions = []) => {
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
      return flattenedOptions.find((o) => o.value === value) || null;
    }
  }
  return null;
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
export const reduceOptions = (dataOptions) => {
  if (dataOptions) {
    return dataOptions.reduce((options, op) => {
      if (op.value) options.push(op);
      if (op.options) return [...options, ...op.options];
      return options;
    }, []);
  }
  return [];
}

// reconcile index of rendered item to items that are only selectable.
export const reconcileReducedIndex = (item, items) => {
  return items.findIndex((i) => isEqual(i, item));
};
