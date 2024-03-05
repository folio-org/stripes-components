import React from 'react';
import AvailableIcons from './AvailableIcons';
import Contexts from './Contexts';
import CustomIcon from './CustomIcon';
import Styles from './Styles';
import IconWithLabel from './IconWithLabel';
import Icon from '../Icon';

export default {
  title: 'Icon',
};

export const _AvailableIcons = () => <AvailableIcons />;
export const _CustomIcon = () => <CustomIcon />;

_CustomIcon.storyName = 'Custom icon';

export const _Contexts = () => <Contexts />;
export const Label = () => <IconWithLabel />;

export const Statuses = () => (
  <div>
    <div>
      <pre>
        <strong>success</strong>
      </pre>
      <Icon size="large" icon="info" status="success" />
    </div>
    <div>
      <pre>
        <strong>warn</strong>
      </pre>
      <Icon size="large" icon="info" status="warn" />
    </div>
    <div>
      <pre>
        <strong>error</strong>
      </pre>
      <Icon size="large" icon="info" status="error" />
    </div>
  </div>
);

export const _Styles = () => <Styles />;
