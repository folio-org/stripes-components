import { useEffect } from 'react';

const useClickOutside = (ref, onClick) => {
  useEffect(() => {
    const handleClick = (e) => {
      const isOutside = ref.current && !ref.current.contains(e.target);
      onClick(e, isOutside);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, onClick]);
};

export default useClickOutside;
