import express from 'express';
import cors from 'cors';
// Legacy routes (CS:GO) — отключаем для RandarNFT
// import skinsRouter from './skins';
// import profileRouter from './profile';
// import radarRouter from './radar';
// import inventoryRouter from './inventory';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Маршруты — пока выключены старые CS:GO эндпоинты
// app.use('/api', skinsRouter);
// app.use('/api', profileRouter);
// app.use('/api/radar', radarRouter);
// app.use('/api', inventoryRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
