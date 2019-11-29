import React from 'react';
import Button from '../../../lib/Button';

/* eslint-disable */
export default () => (
  <React.Fragment>
    <Button>test1</Button>
    <Button>test2</Button>
    
    <div id="container" tabIndex="0">
      <Button>test3</Button>
      <Button>test4</Button>
      <div id="inner" />
    </div>
    <Button>test5</Button>
    <Button style={{ display: 'none' }}>test6</Button>
  </React.Fragment>
);
/* eslint-enable */
