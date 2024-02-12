import sha1 from 'sha1';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './db';
import redisClient from './redis';


const getUserAuth = async (req) => {
  const auth = req.headers.auth || null;

  if (!auth) {
    return null;
  }

  const authParts = auth.split(' ');
  if (authParts.length !== 2) {
    return null;
  }

  if (authParts[0] !== 'Basic') {
    return null;
  }

  const decodedToken = Buffer.from(authParts[1], 'base64').toString();
  const delimiterPosition = decodedToken.indexOf(':');
  const email = decodedToken.substring(0, delimiterPosition);
  const password = decodedToken.substring(delimiterPosition + 1);
  
  const user = await (await dbClient.usersCollection()).findOne({email});

  if (!user) {
    return null;
  }

  if (sha1(password) !== user.password) {
    return null;
  }
  return user;
};

export const getXtoken = async (req) => {
  const token = req.headers['x-token'];

  if (!token) {
    return null;
  }
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    return null;
  }
  const user = await (await dbClient.usersCollection())
    .findOne({_id: new mongoDBCore.BSON.ObjectId(userId)});
  return user || null;
};

export const basicAuthentication = async (req, res, next) => {
  const user = await getUserAuth(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
  };

  export const xTokenAuthentication = async (req, res, next) => {
  const user = await getXtoken(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
  };

module.exports = basicAuthentication;
module.exports = xTokenAuthentication;
