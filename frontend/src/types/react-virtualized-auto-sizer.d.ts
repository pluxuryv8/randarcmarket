declare module 'react-virtualized-auto-sizer' {
  import * as React from 'react';
  export interface AutoSizerProps {
    children: (size: { width: number; height: number }) => React.ReactNode;
    defaultWidth?: number;
    defaultHeight?: number;
    disableWidth?: boolean;
    disableHeight?: boolean;
    style?: React.CSSProperties;
  }
  const AutoSizer: React.FC<AutoSizerProps>;
  export default AutoSizer;
}


