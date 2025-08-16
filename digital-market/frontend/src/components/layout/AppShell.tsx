import React, { useEffect, useState } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { TonConnectButton } from '@tonconnect/ui-react';
import SearchBar from '../ui/SearchBar';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elevated, setElevated] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box className="page-scrim" sx={{ minHeight: '100vh', bgcolor: 'var(--c-bg)' }}>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{
          height: 64,
          background: elevated ? 'rgba(16,17,20,0.7)' : 'transparent',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--c-line)',
        }}
      >
        <Toolbar disableGutters sx={{ height: '100%' }}>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5, flexShrink: 0 }}>
              <span style={{ color: 'var(--c-brand)' }}>RANDAR</span>
              <span style={{ color: 'var(--c-text)' }}> NFT</span>
            </Typography>
            
            <Box sx={{ flex: 1, maxWidth: 600, mx: 'auto' }}>
              <SearchBar placeholder="Поиск коллекций и NFT" />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <IconButton size="small" color="inherit" aria-label="pearls" sx={{ color: 'var(--c-muted)' }}>
                💎
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="gifts" sx={{ color: 'var(--c-muted)' }}>
                🎁
              </IconButton>
              <TonConnectButton />
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      
      <main>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {children}
        </Container>
      </main>
    </Box>
  );
};

export default AppShell;


