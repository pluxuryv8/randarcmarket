import React from 'react';
import { Card, CardContent } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { motion } from 'framer-motion';

const items = [
  {
    Icon: FlashOnIcon,
    title: 'Мгновенно',
    text: 'Цены обновляются в реальном времени',
  },
  {
    Icon: SavingsIcon,
    title: 'Экономия',
    text: 'Всего 1% комиссия',
  },
  {
    Icon: SecurityIcon,
    title: 'Безопасно',
    text: 'Защита сделок через Steam',
  },
  {
    Icon: AttachMoneyIcon,
    title: 'Заработок',
    text: 'Перепродажа скинов и NFT',
  },
];

export const WhySection: React.FC = () => {
  return (
    <section id="why" className="py-20 bg-black">
      <h2 className="text-4xl text-center mb-12 text-white">Почему RandarNFT?</h2>
      <div className="container mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            <Card className="bg-gray-800 hover:bg-gray-700 transform hover:-translate-y-1 transition">
              <CardContent className="flex flex-col items-center p-6">
                <Icon className="text-red-600 w-12 h-12 mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-center text-sm">{text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
