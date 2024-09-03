// returns or creates a div#OverlayContainer
import { useRef } from 'react';
import { OVERLAY_CONTAINER_ID } from '../../util/consts';

export default () => {
  const element = useRef(document.getElementById(OVERLAY_CONTAINER_ID));
  if (!element.current) {
    element.current = document.getElementById('root');
    if (element.current.children.length > 0) {
      element.current = element.current.children[0];
    }
  }
  return element.current;
};
