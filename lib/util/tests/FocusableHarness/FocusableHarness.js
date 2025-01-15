import React from 'react';
import Button from '../../../Button';

/* eslint-disable */
export default () => (
  <>
    <Button id="test1">test1</Button>
    <Button id="test2">test2</Button>

    <div id="container" tabIndex="0">
      <Button id="test3">test3</Button>
      <Button id="test4">test4</Button>
      <div id="inner" />
    </div>
    <Button id="test5">test5</Button>
    <Button style={{ display: 'none' }} id="test6">test6</Button>
  </>
);
/* eslint-enable */
