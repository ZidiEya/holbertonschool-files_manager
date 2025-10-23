// Import the Express framework
import express from 'express';

// Import all route controllers from the 'routes/index.js' file
// This file is expected to contain a function that registers routes on the Express app
import controllerRouting from './routes/index';

// Define the server port
// Use the environment variable PORT if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Register all routes (controllers) by calling the imported function
// This keeps your route organization modular and clean
controllerRouting(app);

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app instance (useful for testing or integrating with other modules)
export default app;
