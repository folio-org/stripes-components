// returns or creates a div#OverlayContainer
// this helps to make modals, etc work in test suites
// in contextes where there may not be a div#OverlayContainer

import { useState, useEffect } from 'react';
import { OVERLAY_CONTAINER_ID } from '../../util/consts';

const resolveElement = (ref) => {
  if (ref === null) {
    let el = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!el) {
      el = document.getElementById('root');
      if (el?.children.length > 0) {
        el = el.children[0];
      } else {
        el = document.body;
      }
    }
    return el;
  }
  return ref;
};

export default (ref) => {
  const [element, setElement] = useState(resolveElement(ref));

  if (!element) {
    const el = resolveElement(ref);
    if (el) setElement(el);
  }

  useEffect(() => {
    const el = resolveElement(ref);
    if (el) setElement(el);
  }, [ref]);

  const refresh = () => {
    if (!element) {
      const el = resolveElement(ref);
      if (!el) setElement(el);
    }
  };

  return {
    element,
    refresh
  };
};
