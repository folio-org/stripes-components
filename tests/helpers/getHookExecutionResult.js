import React, { useEffect, useState, Fragment } from 'react';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { mountWithContext } from '../helpers';

/**
 * getHookExecutionResult
 * Test a hook by returning its result in a promise.
 *
 * @param {*} hook the hook to test
 * @param {*} hookArguments arguments to pass to the hook
 * @returns hook's result, wrapped in a Promise, because that's what mountWithContext
 *   returns and we need to wait for the component that calls the hook to mount and
 *   render.
 */

const getHookExecutionResult = (hook, hookArguments = []) => {
  let result = {};
  const TestComponent = () => {
    const hookResult = Array.isArray(hookArguments)
      ? hook(...hookArguments)
      : hook(hookArguments);
    switch (typeof hookResult) {
      case 'function':
      case 'string':
        result = hookResult;
        break;
      default:
        result = Object.assign(result, hookResult);
    }

    return <></>;
  };

  return mountWithContext(<TestComponent />).then(() => result);
};

const useHookExecutionResult = (hook, hookParams, comparator = isEqual) => {
  const [result, updateResult] = useState(hook(...hookParams));

  const candidate = hook(...hookParams);
  if (!comparator(result, candidate)) {
    updateResult(candidate);
  }
  return result;
};


/**
 * getHookExecutionHarness
 * Test a hook by returning its result in a promise.
 *
 * @param {*} hook the hook to test
 * @param {*} hookArguments arguments to pass to the hook
 * @param {*} Wrapper React component/element to wrap rendered test component in.
 * @param {*} checkEffect Function that will be called each update to result.
 * @param {*} comparator Function to compare two values - a previous value and a potential candidate -
 * for potentially re-rendering the text component/updating state.
 * @returns hook's result, wrapped in a Promise, because that's what mountWithContext
 *   returns and we need to wait for the component that calls the hook to mount and
 *   render.
 */
export const getHookExecutionHarness = (
  hook,
  hookArguments = [],
  Wrapper = Fragment,
  checkEffect = noop,
  comparator = isEqual
) => {
  let result = {};
  const TestComponent = () => {
    const innerResult = useHookExecutionResult(
      hook,
      Array.isArray(hookArguments)
        ? hookArguments
        : [hookArguments],
      comparator
    );

    useEffect(() => {
      checkEffect(innerResult);
    }, [innerResult]);

    result = innerResult;

    return <></>;
  };

  return mountWithContext(
    <Wrapper>
      <TestComponent />
    </Wrapper>
  ).then(() => result);
};

export default getHookExecutionResult;
