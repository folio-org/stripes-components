import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { IconButtonProps } from '../IconButton/IconButton';

export type PaneHeaderIconButtonProps = IconButtonProps;

/**
 * `PaneHeaderIconButton` is a variant of `IconButton` and accepts the same props.
 */
export const PaneHeaderIconButton: ForwardRefExoticComponent<
  PropsWithoutRef<PaneHeaderIconButtonProps> &
    RefAttributes<HTMLAnchorElement | HTMLButtonElement>
>;
export default PaneHeaderIconButton;
