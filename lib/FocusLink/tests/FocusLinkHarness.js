import React, { useRef } from 'react';
import FocusLink from '../FocusLink';

export default function FocusLinkHarness({testId, targetOnFocus, listProps, ...props}) {
  const list = useRef(null);
  const getList = () => list.current;
  return (
    <>
      <FocusLink targetNextAfter={ getList} {...props }>
        <span>Test focus link</span>
      </FocusLink>
      <ul ref={list} {...listProps}>
        <li><input type="text" name="test"/></li>
        <li><button>test</button></li>
      </ul>
      <input type="text" name="test" id={testId} onFocus={targetOnFocus}/>
    </>
  );
}
