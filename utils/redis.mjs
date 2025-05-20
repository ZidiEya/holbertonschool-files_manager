import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    this.client.connect()
      .then(() => console.log('Redis client connected'))
      .catch((err) => console.error('Redis connection error:', err));
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error('Redis GET error:', err);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setEx(key, duration, value.toString());
    } catch (err) {
      console.error('Redis SET error:', err);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis DEL error:', err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
