import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import LocationController from './app/controllers/LocationController';
import FileController from './app/controllers/FileController';
import OnlineController from './app/controllers/OnlineController';
import SetStatusController from './app/controllers/SetStatusController';
import DislikeController from './app/controllers/DislikeController';
import LikeController from './app/controllers/LikeController';
import DeleteAccountController from './app/controllers/DeleteAccountController';


import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user/create', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/user/updates', UserController.update);

routes.post('/location/send', LocationController.store);

routes.post('/upload/file', upload.single('file'), FileController.store);

routes.get('/users/online', OnlineController.index);

routes.post('/users/dislikes', DislikeController.store);

routes.post('/users/likes', LikeController.store);

routes.post('/set/status', SetStatusController.store);

routes.delete('/delete/account', DeleteAccountController.store);

export default routes;
