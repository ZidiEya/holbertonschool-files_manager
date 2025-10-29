// Import ObjectId from MongoDB to work with MongoDB IDs
import { ObjectId } from 'mongodb';

// Import UUID generator for creating unique file names
import { v4 as uuidv4 } from 'uuid';

// Import Node.js promises version of filesystem module
import { promises as fsPromises } from 'fs';

// Import database client and helper utilities
import dbClient from './db';
import userUtils from './user';
import validatedUtils from './validatedUtils';

/**
 * Module containing utility functions for file operations
 */
const fileUtils = {
  /**
   * Validates if the request body is valid for creating a file
   * @param {Object} request - Express request object
   * @returns {Object} { error: string|null, fileParams: object }
   */
  async validateBody(request) {
    const { name, type, isPublic = false, data } = request.body;
    let { parentId = 0 } = request.body;

    const typesAllowed = ['file', 'image', 'folder'];
    let msg = null;

    if (parentId === '0') parentId = 0;

    // Validate required fields
    if (!name) {
      msg = 'Missing name';
    } else if (!type || !typesAllowed.includes(type)) {
      msg = 'Missing type';
    } else if (!data && type !== 'folder') {
      msg = 'Missing data';
    } else if (parentId && parentId !== '0') {
      // Check if parent exists and is a folder
      let file;
      if (validatedUtils.isValidId(parentId)) {
        file = await this.getFile({ _id: ObjectId(parentId) });
      } else {
        file = null;
      }

      if (!file) {
        msg = 'Parent not found';
      } else if (file.type !== 'folder') {
        msg = 'Parent is not a folder';
      }
    }

    return {
      error: msg,
      fileParams: { name, type, parentId, isPublic, data },
    };
  },

  /**
   * Retrieves a single file document from the database
   * @param {Object} query - MongoDB query object
   * @returns {Object|null} file document
   */
  async getFile(query) {
    return await dbClient.filesCollection.findOne(query);
  },

  /**
   * Retrieves multiple file documents using an aggregation query
   * @param {Array} query - MongoDB aggregation pipeline
   * @returns {Array} list of file documents
   */
  async getFilesOfParentId(query) {
    return await dbClient.filesCollection.aggregate(query);
  },

  /**
   * Saves a file to the database and optionally to disk
   * @param {string} userId - ID of the user uploading the file
   * @param {Object} fileParams - Object containing file attributes
   * @param {string} FOL*
