import Popper from 'popper.js';
import { Component, FocusEventHandler, ReactNode } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { RequireOneOrNone } from '../../util/typeUtils';

/**
 * The default option type to be used, contains a label and potentially a value
 */
export interface MultiSelectionDefaultOptionType<ValueType = never> {
  label: string;
  value: ValueType;
}

/**
 * Props each action may accept
 * @see https://github.com/folio-org/stripes-components/tree/master/lib/MultiSelection#actions
 */
export interface MultiSelectionActionItemProps<
  OptionType = MultiSelectionDefaultOptionType
> {
  /** The search term */
  filterValue: string;
  /** If this search was an exact match */
  exactMatch: boolean;
  /** A list of all rendered items */
  renderedItems: ReadonlyArray<OptionType>;
}

export interface MultiSelectionBaseProps<
  OptionType = MultiSelectionDefaultOptionType
> {
  /**
   * Custom actions, such as a "New" row
   * @see https://github.com/folio-org/stripes-components/tree/master/lib/MultiSelection#actions
   */
  actions?: {
    onSelect: () => void;
    render: (props: MultiSelectionActionItemProps<OptionType>) => ReactNode;
  }[];
  /** Adds an accessible label if no `label` is provided */
  ariaLabelledBy?: string;
  /**
   * Allows {@link filter} to run asynchronously (e.g. on a server); with
   * {@link dataOptions} undefined or null a loading spinner will show
   */
  asyncFiltering?: boolean;
  /** If the field should auto-focus on mount */
  autoFocus?: boolean;
  /** If backspace should remove a selected items */
  backspaceDeletes?: boolean;
  /** The items to choose from.  If null or undefined, a loading spinner will be shown */
  dataOptions: OptionType[] | null | undefined;
  /** Marks the field as changed, for styling */
  dirty?: boolean;
  /** Disables the input field */
  disabled?: boolean;
  /** The message to show when no items were found with a given search */
  emptyMessage?: string;
  /** An error to show for validation */
  error?: ReactNode;
  /** A custom filter function, either directly gives results or does something async */
  filter?: (
    filterText: string | undefined,
    list: OptionType[]
  ) => { renderedItems: OptionType[]; exactMatch?: boolean } | Promise<void>;
  /** A custom formatter to render each option */
  formatter?: (option: OptionType, searchTerm: string | undefined) => ReactNode;
  /** Adds a custom ID to the control */
  id?: string;
  /** If true, adds valid styles to the field */
  isValid?: boolean;
  /** A custom formatter to get string representations of objects for accessibility */
  itemToString?: (option: OptionType) => string;
  /** A label for the field */
  label?: ReactNode;
  /** The maximum height for the options menu, in pixels */
  maxHeight?: number;
  /** Modifiers for how the overlay should render */
  modifiers?: Popper.Modifiers;
  /** Fired when the user clicks out of/deselects the control */
  onBlur?: FocusEventHandler;
  /** Fired anytime internal state changes */
  onChange?: (selectedItems: OptionType[]) => void;
  /** Fired when an item is removed */
  onRemove?: (removedItem: OptionType) => void;
  /** A placeholder for the control when there is no value */
  placeholder?: string;
  /** Render to the global overlay, if the dropdown may be cut off due to some containing elements's overflow */
  renderToOverlay?: boolean;
  /** If the field is required */
  required?: boolean;
  /** If validation styles should be rendered */
  validationEnabled?: boolean;
  /** The selected objects */
  value?: OptionType[];
  /** Same as {@link formatter}, `formatter` should probably be used instead. */
  valueFormatter?: (
    option: OptionType,
    searchTerm: string | undefined
  ) => ReactNode;
  /** Inline feedback for the user indicating a validation warning */
  warning?: ReactNode;
}

export type MultiSelectionProps<OptionType = MultiSelectionDefaultOptionType> =
  RequireOneOrNone<
    MultiSelectionBaseProps<OptionType>,
    'valueFormatter' | 'formatter'
  >;

export type MultiSelectionFieldRenderProps<OptionType> = FieldRenderProps<
  OptionType[]
>;

/**
 * Multiple selection control, allowing filtering of options
 * @example
 * const optionList = [
 *   { value: 'test0', label: 'Option 0' },
 *   { value: 'test1', label: 'Option 1' },
 *   { value: 'test2', label: 'Option 2' },
 *   // ...
 * ];
 *
 * <MultiSelection
 *     label="my multiselect"
 *     id="my-multiselect"
 *     dataOptions={optionList}
 * />
 */
export default class MultiSelection<
  OptionType = MultiSelectionDefaultOptionType,
  AdditionalProps extends
    | MultiSelectionProps<OptionType>
    | MultiSelectionFieldRenderProps<OptionType> = MultiSelectionProps<OptionType>
> extends Component<MultiSelectionProps<OptionType> & AdditionalProps> {}
