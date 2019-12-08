import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import LocationController from './app/controllers/LocationController';
import FileController from './app/controllers/FileController';
import GetUsersController from './app/controllers/GetUsersController';
import DislikeController from './app/controllers/DislikeController';
import LikeController from './app/controllers/LikeController';
import DeleteAccountController from './app/controllers/DeleteAccountController';
import GetInfosController from './app/controllers/GetInfosController';
import GetMatchesController from './app/controllers/GetMatchesController';
import PostController from './app/controllers/PostController';
import GetPostController from './app/controllers/GetPostsController';
import BlockMatchesController from './app/controllers/BlockMatchesController';
import GetSessionsController from './app/controllers/GetSessionsController';
import LogoutController from './app/controllers/LogoutController';


import authMiddleware from './app/middlewares/auth';


const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user/create', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/user/updates', UserController.update);

routes.post('/location/send', LocationController.store);

routes.post('/upload/file', upload.single('file'), FileController.store);

routes.get('/users/online', GetUsersController.index);

routes.post('/users/dislikes', DislikeController.store);

routes.post('/users/likes', LikeController.store);

routes.delete('/delete/account', DeleteAccountController.store);

routes.get('/user/getinfos', GetInfosController.store);

routes.get('/matches', GetMatchesController.index);

routes.post('/posts/publish', upload.single('file'), PostController.store);

routes.get('/posts', GetPostController.index);

routes.post('/block/matches', BlockMatchesController.store);

routes.get('/sessions/list', GetSessionsController.index);

routes.get('/logout', LogoutController.store);

export default routes;
