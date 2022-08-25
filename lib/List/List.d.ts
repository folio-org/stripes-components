import { Component, ReactNode } from 'react';

export interface ListProps<ItemType> {
  /** What should be displayed if the list is empty */
  isEmptyMessage?: ReactNode;
  /** A custom formatter for rendering the generic `ItemType` */
  itemFormatter?: (item: ItemType, i: number) => ReactNode;
  /** The list's items */
  items: ItemType[];
  /** Adds a custom class to the list */
  listClass?: string;
  /** Sets the list's style */
  listStyle?: 'default' | 'bullets';
  /** Removes margin from the bottom of the list */
  marginBottom0?: boolean;
}

/**
 * Renders a list of items
 * @example
 * const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];
 * const itemFormatter = (item) => (<li>{item}</li>);
 * const isEmptyMessage = 'No items to show';
 *
 * <List
 *   items={items}
 *   itemFormatter={itemFormatter}
 *   isEmptyMessage={isEmptyMessage}
 * />
 * @example
 * const items = [{foo: "bar"}, {foo: "baz"}];
 * <List
 *   items={items}
 *   itemFormatter={(item, i) => {
 *     return <li key={i}>{item}</li>
 *   }}
 * />
 */
// must extend component as it's impossible to provide a proper export with FunctionComponent
export default class List<ItemType = ReactNode> extends Component<
  ListProps<ItemType>
> {}
