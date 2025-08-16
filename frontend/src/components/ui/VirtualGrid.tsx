import React from 'react';
import { Box } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey?: (index: number) => string | number;
  gap?: number;
  containerHeight?: number;
  extraItemHeight?: number;
}

function VirtualGrid<T>({
  items,
  renderItem,
  itemKey,
  gap = 16,
  containerHeight = 720,
  extraItemHeight = 110
}: VirtualGridProps<T>) {
  return (
    <Box sx={{ height: { xs: 560, sm: 640, md: containerHeight } }}>
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          const columns = width < 600 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 4;
          const totalGap = gap * (columns - 1);
          const itemWidth = Math.max(160, Math.floor((width - totalGap) / columns));
          const rowHeight = itemWidth + extraItemHeight;
          const rowCount = Math.ceil(items.length / columns);

          return (
            <Grid
              width={width}
              height={height}
              columnCount={columns}
              columnWidth={itemWidth}
              rowCount={rowCount}
              rowHeight={rowHeight}
              itemKey={({ columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }) => {
                const index = rowIndex * columns + columnIndex;
                return itemKey ? itemKey(index) : index;
              }}
            >
              {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
                const index = rowIndex * columns + columnIndex;
                if (index >= items.length) return null;
                return (
                  <Box style={style} sx={{ pr: columnIndex < columns - 1 ? `${gap}px` : 0, pb: `${gap}px` }}>
                    {renderItem(items[index], index)}
                  </Box>
                );
              }}
            </Grid>
          );
        }}
      </AutoSizer>
    </Box>
  );
}

export default VirtualGrid;


