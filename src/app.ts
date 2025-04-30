import express from 'express';
import { RoomRoutes } from './routes';

export const app = express();

app.use(express.json());
app.use('/api/room', RoomRoutes);
