import {
  MultiSelect,
  MultiSelectMenu,
  MultiSelectOption,
} from '@folio/stripes-testing';

const toArray = (values) => (Array.isArray(values) ? values : [values]);

// Local override of `select` that leaves the menu open (the stripes-testing version closes it).
export default MultiSelect.extend('local multiselect')
  .actions({
    select: async (interactor, values) => {
      await interactor.open();
      for (const value of toArray(values)) {
        await MultiSelectMenu().find(MultiSelectOption(value)).click();
      }
    },
  });
