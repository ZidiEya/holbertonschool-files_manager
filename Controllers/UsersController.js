// Import ObjectId from MongoDB for ID validation
import { ObjectId } from 'mongodb';
// Import SHA-1 for password hashing
import sha1 from 'sha1';
// Import Bull queue for background processing
import Queue from 'bull';
// Import database client and user utilities
import dbClient from '../utils/db';
import userUtils from '../utils/user';

// Initialize a queue for user-related background tasks
const userQueue = new Queue('userQueue');

/**
 * Controller for handling user operations (create user, get profile)
 */
export default class UsersController {
  /**
   * POST /users
   * Registers a new user
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate required fields
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    // Check if email already exists in DB
    const existEmail = await dbClient.usersCollection.findOne({ email });
    if (existEmail) return res.status(400).send({ error: 'Already exist' });

    // Hash the password using SHA-1
    const passwordSha1 = sha1(password);

    let returnResult;
    try {
      // Insert new user into MongoDB
      returnResult = await dbClient.usersCollection.insertOne({
        email,
        password: passwordSha1,
      });
    } catch (err) {
      // If insertion fails, enqueue a background job and return error
      await userQueue.add({});
      return res.status(500).send({ error: 'Error creating user' });
    }

    // Construct user object to return (without password)
    const user = {
      id: returnResult.insertedId,
      email,
    };

    // Add a background job for the new user (e.g., sending welcome email)
    await userQueue.add({
      userId: returnResult.insertedId.toString(),
    });

    return res.status(201).send(user);
  }

  /**
   * GET /users/me
   * Returns the authenticated user's profile
   */
  static async getMe(request, response) {
    // Get userId from request token
    const { userId } = await userUtils.getUserIdAndKey(request);

    // Fetch user from MongoDB
    const user = await userUtils.getUser({ _id: ObjectId(userId) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // R
