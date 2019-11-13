import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import resize from './config/resize';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import LocationController from './app/controllers/LocationController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

// routes.get('/', (req, res) => {
//   res.type('image/png');
//   resize('download.jpeg').pipe(res);
// });

routes.post('/user/create', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/user/updates', UserController.update);

routes.post('/upload/file', upload.single('file'), FileController.store);

routes.post('/location/send', LocationController.store);

export default routes;
