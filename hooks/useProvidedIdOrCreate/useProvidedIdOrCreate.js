import { useId, useRef } from 'react';

const useProvidedIdOrCreate = (id, prefix = '') => {
  const autoId = `${prefix}${useId()}`;
  return useRef(id || autoId).current;
};

export default useProvidedIdOrCreate;
