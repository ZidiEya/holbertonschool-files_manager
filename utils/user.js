// Import Redis client for accessing tokens
import redisClient from './redis';
// Import MongoDB client for accessing user data
import dbClient from './db';

/**
 * Module containing utility functions for user-related operations
 */
const userUtils = {
  /**
   * Retrieves a user ID and Redis key from an Express request
   * @param {Object} request - Express request object
   * @returns {Object} { userId: string|null, key: string|null }
   */
  async getUserIdAndKey(request) {
    // Initialize return object with nulls
    const obj = { userId: null, key: null };

    // Get the X-Token header from the request
    const xToken = request.header('X-Token');

    // If no token, return nulls
    if (!xToken) return obj;

    // Construct the Redis key used for token storage
    obj.key = `auth_${xToken}`;

    // Get the userId stored in Redis using the key
    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  /**
   * Retrieves a user document from MongoDB
   * @param {Object} query - MongoDB query to find the user
   * @returns {Object|null} user document or null if not found
   */
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

// Export the user utilities module for use in other parts of the app
export default userUtils;
