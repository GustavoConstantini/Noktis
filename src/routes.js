import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import LocationController from './app/controllers/LocationController';
import FileController from './app/controllers/FileController';
import GetOnlineController from './app/controllers/GetOnlineController';
import SetStatusController from './app/controllers/SetStatusController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user/create', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/user/updates', UserController.update);

routes.post('/location/send', LocationController.store);

routes.post('/upload/file', upload.single('file'), FileController.store);

routes.get('/users/online', GetOnlineController.store);

routes.post('/set/status', SetStatusController.store);

export default routes;
