// returns or creates a div#OverlayContainer
// this helps to make modals, etc work in test suites
// in contextes where there may not be a div#OverlayContainer

import { useRef } from 'react';
import { OVERLAY_CONTAINER_ID } from '../../util/consts';

export default () => {
  const element = useRef(null);

  const refresh = () => {
    element.current = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!element.current) {
      element.current = document.getElementById('root');
      if (element.current.children.length > 0) {
        element.current = element.current.children[0];
      }
    }
  }

  refresh();
  return {
    element: element.current,
    refresh
  }
};
