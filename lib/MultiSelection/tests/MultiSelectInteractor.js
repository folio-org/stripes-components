import {
  MultiSelect,
  MultiSelectMenu,
  MultiSelectOption,
} from '@folio/stripes-testing';

// Local overrides of the stripes-testing MultiSelect interactor until it is updated for the
// current markup: the container no longer has role="application" or aria-expanded.
// aria-expanded lives on the combobox (the filter input on large screens).
const isExpanded = (el) => el.querySelector('[role=combobox]').getAttribute('aria-expanded') === 'true';

const setOpen = (shouldOpen) => async (interactor) => {
  let expanded;
  await interactor.perform((el) => { expanded = isExpanded(el); });
  if (expanded !== shouldOpen) {
    await interactor.toggle();
  }
};

const toArray = (values) => (Array.isArray(values) ? values : [values]);

export default MultiSelect.extend('local multiselect')
  .selector('[class^=multiSelectContainer-]')
  .filters({
    open: isExpanded,
    ariaLabelledby: (el) => el.querySelector('[role=combobox]').getAttribute('aria-labelledby'),
  })
  .actions({
    open: setOpen(true),
    close: setOpen(false),
    select: async (interactor, values) => {
      await interactor.open();
      for (const value of toArray(values)) {
        await MultiSelectMenu().find(MultiSelectOption(value)).click();
      }
    },
  });
