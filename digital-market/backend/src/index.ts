import express from 'express';
import cors from 'cors';
import skinsRouter from './skins';
import profileRouter from './profile';
import radarRouter from './radar';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api', skinsRouter);
app.use('/api', profileRouter);
app.use('/api/radar', radarRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
