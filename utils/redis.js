import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class oject for Redis client
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.connected = false;
    this.client.on('error', (error) => {
      console.log(`Redis error: => ${error}`);
      this.connected = false;
    });
    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
