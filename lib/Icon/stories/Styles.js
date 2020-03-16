import React from 'react';
import Icon from '../Icon';
import Headline from '../../Headline';

export default () => {
  return (
    <>
      <Headline size="large" margin="none">Action icon</Headline>
      <Headline size="medium" faded>Add iconStyle=&quot;action&quot; to convert any icon into an action icon</Headline>
      <Icon
        icon="replace"
        iconStyle="action"
      />
      {' '}
      <Icon
        icon="trash"
        iconStyle="action"
      />
      {' '}
      <Icon
        icon="plus-sign"
        iconStyle="action"
      />
    </>
  );
};
