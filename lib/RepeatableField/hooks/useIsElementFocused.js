import { useEffect, useState } from "react";

export const useIsElementFocused = (ref) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const checkIfFocused = () => {
      if (ref.current) {
        const focusedElement = document.activeElement;
        if (ref.current.contains(focusedElement)) {
          setIsFocused(true);
        } else {
          setIsFocused(false);
        }
      }
    };

    window.addEventListener("focusin", checkIfFocused);
    window.addEventListener("focusout", checkIfFocused);

    checkIfFocused();

    return () => {
      window.removeEventListener("focusin", checkIfFocused);
      window.removeEventListener("focusout", checkIfFocused);
    };
  }, [ref]);

  return isFocused;
};
