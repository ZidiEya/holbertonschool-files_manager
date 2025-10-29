// Import UUID generator for creating unique tokens
import { v4 as uuidv4 } from 'uuid';
// Import SHA-1 hashing for password verification
import sha1 from 'sha1';
// Import Redis client to store authentication tokens
import redisClient from '../utils/redis';
// Import user utilities to fetch users from DB and Redis
import userUtils from '../utils/user';

/**
 * Controller handling authentication (login/logout)
 */
export default class AuthController {
  /**
   * GET /connect
   * Authenticates a user using Basic Auth and returns a token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getConnet(req, res) {
    // Read the Authorization header
    const Authorization = req.header('Authorization') || '';

    // Extract Base64 credentials (format: "Basic base64(email:password)")
    const credentials = Authorization.split(' ')[1];

    if (!credentials) return res.status(401).send({ error: 'Unauthorized' });

    // Decode Base64 to "email:password"
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');

    const [email, password] = decodedCredentials.split(':');

    // Validate email and password presence
    if (!email || !password) return res.status(401).send({ error: 'Unauthorized' });

    // Hash the password using SHA-1
    const sha1Password = sha1(password);

    // Fetch the user from database
    const user = await userUtils.getUser({
      email,
      password: sha1Password,
    });

    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    // Generate a unique authentication token
    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursForExpiration = 24; // Token expires in 24 hours

    // Store token in Redis with expiration
    await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

    // Return token to client
    return res.status(200).send({ token });
  }

  /**
   * GET /disconnect
   * Logs out a user by deleting their token from Redis
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDisconnect(req, res) {
    // Get userId and Redis key from request token
    const { userId, key } = await userUtils.getUserIdAndKey(req);

    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    // Delete the token from Redis to log out
    await redisClient.del(key);

    // Respond with 204 No Content
    return res.status(204).send();
  }
}
