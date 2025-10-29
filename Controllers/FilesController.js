// Import MongoDB ObjectId to validate and query IDs
import { ObjectId } from 'mongodb';
// Import mime-types for setting correct Content-Type headers
import mime from 'mime-types';
// Import Bull queue for background processing
import Queue from 'bull';
// Import user and file utility modules
import userUtils from '../utils/user';
import fileUtils from '../utils/file';
import validatedUtils from '../utils/validatedUtils';

// Folder path to store files locally
const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

// Initialize a background queue named "fileQueue"
const fileQueue = new Queue('fileQueue');

/**
 * Controller for handling file operations (upload, show, list, publish)
 */
export default class FilesController {
  /**
   * POST /files
   * Handles uploading a new file or folder
   */
  static async postUpload(request, response) {
    // Get authenticated user's ID from token
    const { userId } = await userUtils.getUserIdAndKey(request);

    if (!validatedUtils.isValidId(userId)) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    // Fetch the user document from DB
    const user = await userUtils.getUser({ _id: ObjectId(userId) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Validate request body for required file fields
    const { error: validationError, fileParams } = await fileUtils.validateBody(request);
    if (validationError) return response.status(400).send({ error: validationError });

    // Validate parent folder if provided
    if (fileParams.parentId !== 0 && !validatedUtils.isValidId(fileParams.parentId)) {
      return response.status(400).send({ error: 'Parent not found' });
    }

    // Save the file to disk and DB
    const { error, code, newFile } = await fileUtils.saveFile(userId, fileParams, FOLDER_PATH);
    if (error) {
      // Retry background queue for image uploads
      if (response.body.type === 'image') await fileQueue.add({ userId });
      return response.status(code).send(error);
    }

    // Add image processing job to background queue
    if (fileParams.type === 'image') {
      await fileQueue.add({
        fileId: newFile.id.toString(),
        userId: newFile.userId.toString(),
      });
    }

    return response.status(201).send(newFile);
  }

  /**
   * GET /files/:id
   * Shows a specific file's metadata for a user
   */
  static async getShow(request, response) {
    const fileId = request.params.id;
    const { userId } = await userUtils.getUserIdAndKey(request);

    // Fetch user from DB
    const user = await userUtils.getUser({ _id: ObjectId(userId) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Validate IDs
    if (!validatedUtils.isValidId(fileId) || !validatedUtils.isValidId(userId)) {
      return response.status(404).send({ error: 'Not found' });
    }

    const result = await fileUtils.getFile({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!result) return response.status(404).send({ error: 'Not found' });

    const file = fileUtils.processFile(result);
    return response.status(200).send(file);
  }

  /**
   * GET /files
   * Lists files under a parent folder with pagination
   */
  static async getIndex(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);
    const user = await userUtils.getUser({ _id: ObjectId(userId) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Get parentId and page query params
    let parentId = request.query.parentId || '0';
    if (parentId === '0') parentId = 0;
    let page = Number(request.query.page) || 0;
    if (Number.isNaN(page)) page = 0;

    // Validate parent folder if not root
    if (parentId !== 0 && parentId !== '0') {
      if (!validatedUtils.isValidId(parentId)) return response.status(401).send({ error: 'Unauthorized' });

      parentId = ObjectId(parentId);
      const folder = await fileUtils.getFile({ _id: ObjectId(parentId) });
      if (!folder || folder.type !== 'folder') return response.status(200).send([]);
    }

    // Aggregation pipeline for pagination
    const pipeline = [
      { $match: { parentId } },
      { $skip: page * 20 },
      { $limit: 20 },
    ];

    const fileCursor = await fileUtils.getFilesOfParentId(pipeline);
    const fileList = [];
    await fileCursor.forEach((doc) => {
      const document = fileUtils.processFile(doc);
      fileList.push(document);
    });

    return response.status(200).send(fileList);
  }

  /**
   * PUT /files/:id/publish
   * Makes a file public
   */
  static async putPublish(request, response) {
    const { error, code, updatedFile } = await fileUtils.publishUnpublish(request, true);
    if (error) return response.status(code).send({ error });
    return response.status(code).send(updatedFile);
  }

  /**
   * PUT /files/:id/unpublish
   * Makes a file private
   */
  static async putUnpublish(request, response) {
    const { error, code, updatedFile } = await fileUtils.publishUnpublish(request, false);
    if (error) return response.status(code).send({ error });
    return response.status(code).send(updatedFile);
  }

  /**
   * GET /files/:id/data
   * Retrieves the actual content of a file
   */
  static async getFile(request, response) {
    const { u
