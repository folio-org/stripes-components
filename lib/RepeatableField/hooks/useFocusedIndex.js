import usePrevious from "../../../hooks/usePrevius";
import { useEffect, useState } from "react";

export const useFocusedIndex = (fieldsLength) => {
  const [focusIndex, setFocusIndex] = useState(null);

  const prevFieldsLength = usePrevious(fieldsLength);

  useEffect(() => {
    if (fieldsLength > prevFieldsLength) { // added
      setFocusIndex(fieldsLength - 1);
    } else { // removed
      setFocusIndex(null);
    }
  }, [fieldsLength])

  return focusIndex;
};
