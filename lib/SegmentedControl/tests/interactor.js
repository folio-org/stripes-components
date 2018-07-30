import {
    attribute,
    hasClass,
    interactor,
    value,
} from '@bigtest/interactor';

import styles from '../SegmentedControl.css';
import { text } from '../../../node_modules/@storybook/addon-knobs';
    //should i get rid of this? 

export default interactor(class SegmentedControlInteractor {
    id = attribute('input', 'id');
    inputValue = value('input');
    // ^ do i need more?
});
