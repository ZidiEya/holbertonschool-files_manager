// Import ObjectId from MongoDB to validate MongoDB IDs
import { ObjectId } from 'mongodb';

/**
 * Utility module for validation functions
 */
const validatedUtils = {
  /**
   * Checks if a given value is a valid MongoDB ObjectId
   * @param {string} id - The value to validate
   * @returns {boolean} true if valid ObjectId, false otherwise
   */
  isValidId(id) {
    try {
      // Attempt to create an ObjectId from the value
      ObjectId(id);
    } catch (err) {
      // If an error is thrown, it's not a valid ObjectId
      return false;
    }
    // No error thrown → valid ObjectId
    return true;
  },
};

// Export the validation utilities
export default validatedUtils;
