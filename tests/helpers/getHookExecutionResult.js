import React from 'react';
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
    const hookResult = hook(...hookArguments);
    if (typeof hookResult === 'function') {
      result = hookResult;
    } else {
      Object.assign(result, hookResult);
    }

    return <></>;
  };

  return mountWithContext(<TestComponent />).then(() => result);
};

export default getHookExecutionResult;
