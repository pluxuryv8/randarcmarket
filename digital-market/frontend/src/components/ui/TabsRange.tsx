import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { TimeRange } from '../../types/domain';

interface Props {
	value: TimeRange;
	onChange?: (v: TimeRange)=>void;
}

const TabsRange: React.FC<Props>=({ value, onChange })=>{
	return (
		<ToggleButtonGroup
			size="small"
			value={value}
			exclusive
			onChange={(_, v)=> v && onChange?.(v)}
			color="primary"
			sx={{
				background: 'var(--c-card)',
				border: '1px solid var(--c-line)',
				borderRadius: 8,
				'& .MuiToggleButton-root': {
					color: 'var(--c-muted)',
					border: 'none',
					borderRadius: 6,
					px: 2,
					py: 0.5,
					fontSize: '12px',
					fontWeight: 500,
					'&.Mui-selected': {
						background: 'var(--c-brand)',
						color: 'var(--c-text)',
						'&:hover': {
							background: 'var(--c-brand)',
						},
					},
					'&:hover': {
						background: 'rgba(255,255,255,0.05)',
					},
				},
			}}
		>
			<ToggleButton value="1d">1д</ToggleButton>
			<ToggleButton value="7d">7д</ToggleButton>
			<ToggleButton value="30d">30д</ToggleButton>
			<ToggleButton value="all">всё</ToggleButton>
		</ToggleButtonGroup>
	);
};

export default TabsRange;


