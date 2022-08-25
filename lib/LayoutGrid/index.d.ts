/* eslint-disable max-classes-per-file */
import { Component, ReactNode } from 'react';
import { GridProps, RowProps, ColProps } from 'react-flexbox-grid';

export class Grid extends Component<
  GridProps & {
    children?: ReactNode;
  }
> {}
export class Row extends Component<
  RowProps & {
    children?: ReactNode;
  }
> {}
export class Col extends Component<
  ColProps & {
    children?: ReactNode;
  }
> {}
