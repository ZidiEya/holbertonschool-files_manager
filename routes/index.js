// Import Express framework
import express from 'express';

// Import controllers for handling different routes
// Each controller contains the logic for a specific resource
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

// Export a function that sets up all the routes for the Express app
export default function controllerRouting(app) {
  // Create a new Express Router instance
  // Routers allow you to group route handlers
  const router = express.Router();

  // Mount the router on the root path of the app
  app.use('/', router);

  // ---------- App routes ----------
  // GET /status -> Returns server status (e.g., "OK")
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // GET /stats -> Returns application statistics (number of users, files, etc.)
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // ---------- User routes ----------
  // POST /users -> Register a new user
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  // GET /users/me -> Get info about the currently authenticated user
  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  // ---------- Authentication routes ----------
  // GET /connect -> Connect/login the user (authentication)
  router.get('/connect', (req, res) => {
    AuthController.getConnet(req, res); // Note: "getConnet" might be a typo, should be getConnect
  });

  // GET /disconnect -> Logout the user
  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // ---------- File routes ----------
  // POST /files -> Upload a new file
  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  // GET /files/:id -> Get information about a specific file by ID
  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  // GET /files -> List all files (optionally could support filters)
  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  // PUT /files/:id/publish -> Make a file public
  router.put('/files/:id/publish', (req, res) => {
    FilesController.putPublish(req, res);
  });

  // PUT /files/:id/unpublish -> Make a file private
  router.put('/files/:id/unpublish', (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  // GET /files/:id/data -> Get the actual file content (download or stream)
  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);
  });
}
