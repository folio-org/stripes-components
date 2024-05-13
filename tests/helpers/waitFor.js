export const waitFor = (condition) => {
  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve();
      }
    }, 1);
  });
};
