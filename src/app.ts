import express from 'express';
import { RoomRoutes } from './routes';
import { HttpStatus } from './constants';

export const app = express();

app.use(express.json());
app.use('/api/room', RoomRoutes);
app.get('/', (req, res) => {
  res.status(HttpStatus.OK).json({
    status: 'OK',
  });
});
