declare module 'react-window' {
  import * as React from 'react';

  export interface GridChildComponentProps<T = any> {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data?: T;
  }

  export interface FixedSizeGridProps {
    width: number;
    height: number;
    columnCount: number;
    columnWidth: number;
    rowCount: number;
    rowHeight: number;
    itemKey?: (params: { columnIndex: number; rowIndex: number; data?: any }) => string | number;
    children: (props: GridChildComponentProps) => React.ReactNode;
  }

  export class FixedSizeGrid extends React.Component<FixedSizeGridProps> {}
}


