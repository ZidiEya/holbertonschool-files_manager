// Import MongoClient from the official MongoDB driver
import { MongoClient } from 'mongodb';

// Define MongoDB connection parameters
// Use environment variables if set, otherwise default values
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`; // Full MongoDB connection URL

/**
 * Class for performing operations with MongoDB service
 */
class DBClient {
  constructor() {
    // Connect to MongoDB server
    // useUnifiedTopology: true is recommended by MongoDB driver to opt into new connection management
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        // Connection successful
        // console.log('Connected successfully to server');

        // Store the database instance for later use
        this.db = client.db(DB_DATABASE);

        // Store references to collections
        this.usersCollection = this.db.collection('users'); // users collection
        this.filesCollection = this.db.collection('files'); // files collection
      } else {
        // If connection failed, log error and mark db as false
        console.log(err.message);
        this.db = false;
      }
    });
  }

  /**
   * Checks if connection to MongoDB is alive
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return !!this.db; // Convert db object to boolean
  }

  /**
   * Returns the number of documents in the 'users' collection
   * @returns {Promise<number>} Number of users
   */
  async nbUsers() {
    const numberOfUsers = this.usersCollection.countDocuments(); // Count all documents in users
    return numberOfUsers;
  }

  /**
   * Returns the number of documents in the 'files' collection
   * @returns {Promise<number>} Number of files
   */
  async nbFiles() {
    const numberOfFiles = this.filesCollection.countDocuments(); // Count all documents in files
    return numberOfFiles;
  }
}

// Create a single instance of DBClient (Singleton pattern)
const dbClient = new DBClient();

// Export the instance to be used across the app
export default dbClient;
