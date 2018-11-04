import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import readme from '../readme.md';
import general from './general';
import styles from './styles';
import sizes from './sizes';
import icons from './icons';


storiesOf('Button', module)
  .add('Basic Usage', withReadme(readme, general))
  .add('Styles', withReadme(readme, styles))
  .add('Sizes', withReadme(readme, sizes))
  .add('Icons', withReadme(readme, icons));
