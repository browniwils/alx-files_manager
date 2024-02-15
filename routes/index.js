import { basicAuthentication, xTokenAuthentication } from '../utils/auth';
import AuthController from '../controllers/AuthController';
import AppController from '../controllers/AppController';
import FilesController from '../controllers/FilesController';
import UsersController from '../controllers/UsersController';
import { ResposneError, errorResponse } from '../utils/middleware';

const routes = (app) => {
  // Endpoints
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  app.get('/connect', basicAuthentication, AuthController.getConnect);
  app.get('/disconnect', xTokenAuthentication, AuthController.getDisconnect);

  app.post('/users', UsersController.postNewUser);
  app.get('/users/me', xTokenAuthentication, UsersController.getUser);

  app.post('/files', xTokenAuthentication, FilesController.postUpload);
  app.get('/files/:id', xTokenAuthentication, FilesController.getShow);
  app.get('/files', xTokenAuthentication, FilesController.getIndex);
  app.put('/files/:id/publish', xTokenAuthentication, FilesController.putPublish);
  app.put('/files/:id/unpublish', xTokenAuthentication, FilesController.putUnpublish);
  app.get('/files/:id/data', FilesController.getFile);

  app.all('*', (req, res, next) => {
    errorResponse(new ResposneError(404, `Can't ${req.method} ${req.url}`), req, res, next);
  });
  app.use(errorResponse);
};

export default routes;
