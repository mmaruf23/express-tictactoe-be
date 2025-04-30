import { Router } from 'express';
import { RoomController } from '../controllers';
import {
  validClient,
  validClientWithoutRoom,
  validClientWithRoom,
} from '../middlewares/client.middleware';
import { validRoom } from '../middlewares/room.middleware';

const router = Router();

router.post('/', validClientWithoutRoom, RoomController.create);
router.put('/', validClientWithoutRoom, validRoom, RoomController.join);
router.patch('/', validClientWithRoom, validRoom, RoomController.leave);
router.delete('/', validClient, validRoom, RoomController.erase);

export default router;
