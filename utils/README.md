1️⃣ db.js — MongoDB Client

Purpose: Connects to MongoDB and provides easy access to collections.
Key features:

Connects to MongoDB on startup using MongoClient.

Collections available:

usersCollection

filesCollection

Methods:

isAlive() → checks if MongoDB connection is active.

nbUsers() → counts users in the database.

nbFiles() → counts files in the database.
Usage: Accessed by UsersController, FilesController, and AppController to query or modify MongoDB.

2️⃣ redis.js — Redis Client

Purpose: Connects to Redis for caching and storing temporary data (like auth tokens).
Key features:

Uses createClient() to connect to Redis.

Methods:

isAlive() → checks Redis connection.

get(key) → retrieves value by key.

set(key, value, ttl) → stores value with expiration.

del(key) → deletes a key.
Usage: Used in AuthController for session tokens and userUtils to retrieve userId from token.

3️⃣ user.js — User Utilities

Purpose: Provides helper functions for user-related operations.
Key functions:

getUserIdAndKey(request) → extracts X-Token from request, looks up userId in Redis.

getUser(query) → retrieves a user document from MongoDB by query.
Usage: Used in AuthController and FilesController to authenticate users and get user info.

4️⃣ validatedUtils.js — Validation Utilities

Purpose: Provides helper functions for validating inputs.
Key function:

isValidId(id) → checks if a string is a valid MongoDB ObjectId.
Usage: Used everywhere to validate userId, fileId, and parentId before querying MongoDB.

5️⃣ file.js — File Utilities

Purpose: Handles core file operations: validation, saving, updating, reading files, and publishing.
Key functions:

validateBody(request) → validates request body for creating a file.

getFile(query) → fetches a single file document from MongoDB.

getFilesOfParentId(query) → fetches files under a folder (supports pagination).

saveFile(userId, fileParams, FOLDER_PATH) → saves file to disk and MongoDB.

updateFile(query, set) → updates a file document in MongoDB.

publishUnpublish(request, setPublish) → toggles file's public/private status.

processFile(doc) → converts _id to id and removes sensitive fields.

isOwnerAndPublic(file, userId) → checks if a file is public or owned by user.

getFileData(file, size) → reads file content from disk (supports image sizes).
Usage: Core for FilesController to manage file operations.
