// returns or creates a div#OverlayContainer
import { useRef } from 'react';

export default () => {
  const element = useRef(document.getElementById('OverlayContainer'));
  if (!element.current) {
    element.current = document.getElementById('root');
    if (element.current.children.length > 0) {
      element.current = element.current.children[0];
    }
  }
  return element.current;
};
