import React from 'react';
import { mountWithContext } from '../helpers';

const getHookExecutionResult = (hook, hookArguments = []) => {
  let result = {};
  const TestComponent = () => {
    const hookResult = hook(...hookArguments);
    if (typeof hookResult === 'function') {
      result = hookResult;
    } else {
      Object.assign(result, hookResult);
    }

    return null;
  };

  mountWithContext(<TestComponent />);

  return result;
};

export default getHookExecutionResult;
