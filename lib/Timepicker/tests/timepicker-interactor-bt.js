import {
  HTML,
  TextField,
  IconButton,
  Button,
  including,
} from '@folio/stripes-testing';

export const TimeDropdown = HTML.extend('time dropdown')
  .selector('[data-test-timepicker-dropdown]')
  .filters({
    periodToggle: Button({ id: including('period-toggle') }).exists(),
    hour: (el) => {
      const node = el.querySelector('input[data-test-timepicker-dropdown-hours-input]');
      return node.value ? parseInt(node.value, 10) : '';
    },
    minute: (el) => {
      const node = el.querySelector('input[data-test-timepicker-dropdown-minutes-input]');
      return node.value ? parseInt(node.value, 10) : '';
    },
    focused: (el) => el.contains(document.activeElement)
  })
  .actions({
    clickPeriodToggle: ({ find }) => find(Button({ id: including('period-toggle') })).click(),
    fillHour: ({ find }, value) => find(TextField({ id: including('hour-input') }))
      .perform((el) => {
        const node = el.querySelector('input');
        const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value');
        property.set.call(node, value);
        node.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', bubbles: true, cancelable: false }));
      }),
    fillMinute: ({ find }, value) => find(TextField({ id: including('minute-input') }))
      .perform((el) => {
        const node = el.querySelector('input');
        const property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value');
        property.set.call(node, value);
        node.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', bubbles: true, cancelable: false }));
      }),
    clickConfirm: ({ find }) => find(Button({ id: including('set-time') })).click(),
    clickAddMinute: ({ find }) => find(IconButton({ id: including('next-minute') })).click(),
    clickAddHour: ({ find }) => find(IconButton({ id: including('next-hour') })).click(),
    clickDecrementMinute: ({ find }) => find(IconButton({ id: including('prev-minute') })).click(),
    clickDecrementHour: ({ find }) => find(IconButton({ id: including('prev-hour') })).click(),
  });

export const Timepicker = TextField.extend('timepicker')
  .actions({
    clickDropdownToggle: ({ find }) => find(IconButton({ icon: 'clock' })).click(),
    clickInput: ({ perform }) => perform((el) => el.querySelector('input').click()),
    focusDropdownButton: ({ find }) => find(IconButton({ icon: 'clock' })).focus(),
    clickClear: ({ find }) => find(IconButton({ icon: 'times-circle-solid' })).click(),
  });
