import getEnv from './getEnv';
import express from 'express';
import { basicAuthentication, xTokenAuthentication } from './utils/auth';
import { AuthController } from './controllers/AuthController'
import { AppController } from './controllers/AppController'
import { FilesController } from './controllers/FilesController'
import { UsersController } from './controllers/UsersController'
import { ResposneError, errorResponse } from './utils/middleware';


getEnv();
const port = process.env.PORT || 5000;
const env = process.env.npm_lifecycle_event || 'dev';

const appServer = express();
appServer.use(express.json({limit: '200mb'}));

// Endpoints
appServer.get('/status', AppController.getStatus);
appServer.get('/stats', AppController.getStats);

appServer.get('/connect', basicAuthentication, AuthController.getConnect);
appServer.get('/disconnect', xTokenAuthentication, AuthController.getDisconnect);

appServer.post('/users', UsersController.postNewUser);
appServer.get('/users/me', xTokenAuthentication, UsersController.getUser);

appServer.post('/files', xTokenAuthentication, FilesController.postUpload);
appServer.get('/files/:id', xTokenAuthentication, FilesController.getShow);
appServer.get('/files', xTokenAuthentication, FilesController.getIndex);
appServer.put('/files/:id/publish', xTokenAuthentication, FilesController.putPublish);
appServer.put('/files/:id/unpublish', xTokenAuthentication, FilesController.putUnpublish);
appServer.get('/files/:id/data', FilesController.getFile);

appServer.all('*', (req, res, next) => {
  errorResponse(new ResposneError(404, `Can\'t ${req.method} ${req.url}`), req, res, next);
});
appServer.use(errorResponse);

appServer.listen(port);
