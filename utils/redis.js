// Import Redis client creation function
import { createClient } from 'redis';
// Import promisify utility to convert callback-based functions into Promises
import { promisify } from 'util';

/**
 * Class to handle Redis operations
 */
class RedisClient {
  constructor() {
    // Create a Redis client instance
    this.client = createClient();

    // Convert the callback-based 'get' function to a Promise-based version
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Event listener for successful connection
    this.client.on('connect', () => {
      // console.log('Redis client connected to the server');
    });

    // Event listener for connection errors
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  /**
   * Checks if the Redis client is connected
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get a value from Redis by key
   * @param {string} key - The key to fetch from Redis
   * @returns {Promise<string|null>} The value stored, or null if not found
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Set a key-value pair in Redis with a TTL (expiration)
   * @param {string} key - Key to store
   * @param {string} value - Value to store
   * @param {number} ttl - Time to live in seconds
   */
  async set(key, value, ttl) {
    this.client.setex(key, ttl, value); // setex automatically sets expiration
  }

  /**
   * Delete a key from Redis
   * @param {string} key - Key to delete
   */
  async del(key) {
    this.client.del(key);
  }
}

// Export a single instance of RedisClient (Singleton pattern)
const redisClient = new RedisClient();
export default redisClient;
