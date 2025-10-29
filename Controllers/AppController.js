// Import Redis client for checking Redis connection
import redisClient from '../utils/redis';
// Import MongoDB client for checking database connection and stats
import dbClient from '../utils/db';

/**
 * Controller for app-level endpoints (status and stats)
 */
export default class AppController {
  /**
   * GET /status
   * Returns the current status of Redis and MongoDB connections
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(), // true if Redis is connected
      db: dbClient.isAlive(),       // true if MongoDB is connected
    };
    res.status(200).send(status);   // Send JSON response with status
  }

  /**
   * GET /stats
   * Returns application statistics: number of users and files
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(), // Count of user documents
      files: await dbClient.nbFiles(), // Count of file documents
    };
    res.status(200).send(stats);       // Send JSON response with stats
  }
}
