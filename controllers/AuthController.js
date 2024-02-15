import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect(req, res) {
    const { user } = req;
    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;
