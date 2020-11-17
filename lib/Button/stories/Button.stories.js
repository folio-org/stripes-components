import readme from '../readme.md';
import Button from '../Button';

export { default as General } from './general';
export { default as Styles } from './styles';
export { default as Sizes } from './sizes';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    readme: {
      sidebar: readme,
    },
    design: {
       type: 'figma',
       url: 'https://www.figma.com/file/ZE5vhWDm3lyk8xpUQBzDZD/Motif-2.0-%C2%B7-FOLIO-design-language?node-id=194%3A234'
    }
 }
}
