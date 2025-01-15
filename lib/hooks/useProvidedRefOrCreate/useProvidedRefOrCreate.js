import { useRef } from "react";

/** useProvidedRefOrCreate
 * There are some situations where we only want to create a new ref if one is not provided to a component as a prop.
 * @param providedRef The ref to use - if undefined, will use the ref from a call to React.useRef
 */
export default function useProvidedRefOrCreate(providedRef) {
  const internalRef = useRef(null);
  return providedRef ?
    providedRef :
    internalRef;
}
