import React from 'react';
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material';

const Avatar: React.FC<AvatarProps & { fallback?: string }>=({ src, alt, fallback, ...rest })=>{
	const [broken, setBroken] = React.useState(false);
	const showFallback = broken || !src;
	return (
		<MuiAvatar
			src={showFallback ? undefined : (src as string)}
			alt={alt}
			onError={()=>setBroken(true)}
			{...rest}
		>
			{fallback || (alt ? alt[0]?.toUpperCase() : 'R')}
		</MuiAvatar>
	);
};

export default Avatar;


