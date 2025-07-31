import React from 'react';
import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import { CheckCircle, Speed, Security, MonetizationOn } from '@mui/icons-material';
import Hero from '../components/Hero';

// Карточки преимуществ
const features = [
  {
    icon: <Speed sx={{ fontSize: 40 }} color="primary" />,
    title: 'Молниеносные сделки',
    text: 'Авто-радар находит лучшие предложения за секунды.',
  },
  {
    icon: <Security sx={{ fontSize: 40 }} color="primary" />,
    title: 'Полная безопасность',
    text: 'Ваши аккаунты и средства под надёжной защитой.',
  },
  {
    icon: <MonetizationOn sx={{ fontSize: 40 }} color="primary" />,
    title: 'Честные цены',
    text: 'Минимальная комиссия и справедливые курсы на торгах.',
  },
  {
    icon: <CheckCircle sx={{ fontSize: 40 }} color="primary" />,
    title: 'Гарантия сделки',
    text: 'Все обмены проходят через эскроу-бота для вашего спокойствия.',
  },
];

export default function Home() {
  return (
    <Box>
      <Hero />

      <Box sx={{ backgroundColor: '#121212', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#eee', fontWeight: 700 }}
          >
            Наши преимущества
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
              mt: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  borderRadius: 2,
                  width: { xs: '100%', sm: '45%', md: '22%' },
                  minHeight: 200,
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.text}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}