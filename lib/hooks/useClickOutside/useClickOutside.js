import { useEffect } from 'react';

const useClickOutside = (ref, onClick) => {
  useEffect(() => {
    const handleClick = (e) => {
      const isOutside = ref.current && !ref.current.contains(e.target);
      onClick(e, isOutside);
    };

    // need to catch event in capture phase to process click event before other handlers
    // this is to fix a case when other click handler might remove e.target from DOM
    // and when this handler runs - `contains` will return false because e.target is no longer in DOM
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [ref, onClick]);
};

export default useClickOutside;
