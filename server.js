import getEnv from './getEnv';
import express from 'express';
import routes from './routes';
import errorResponse from './utils/middleware';


getEnv();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json({limit: '200mb'}));

routes(app)
app.use(errorResponse);

app.listen(port);
