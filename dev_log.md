# Development Log

## Implementation of Centralized Logging System

### Overview
Added a centralized logging system using Winston to improve error tracking and application monitoring.

### Date and Time
2024-03-14 15:30 (Vietnam Time - GMT+7)

### Steps Taken

1. Created a new utility file for logging
   - File: `api/utils/logger.js`
   - Content:
     ```javascript
     import winston from 'winston';

     const logger = winston.createLogger({
       level: 'info',
       format: winston.format.combine(
         winston.format.timestamp(),
         winston.format.json()
       ),
       transports: [
         new winston.transports.Console(),
         new winston.transports.File({ filename: 'error.log', level: 'error' }),
         new winston.transports.File({ filename: 'combined.log' }),
       ],
     });

     export function logAction(action, level = 'info', metadata = {}) {
       logger.log({
         level,
         message: `Action: ${action}`,
         ...metadata,
       });
     }

     export default logger;
     ```
   - Purpose: Set up a Winston logger with console and file transports, and create a utility function for easy logging.

2. Updated the main application file
   - File: `api/index.js`
   - Changes:
     - Imported the new logging utility:
       ```javascript
       import { logAction } from './utils/logger.js'
       ```
     - Added logging for server start:
       ```javascript
       app.listen(PORT, () => {
         logAction(`Server started`, 'info', { port: PORT })
       })
       ```
     - Enhanced error handling middleware with logging:
       ```javascript
       app.use((err, req, res, next) => {
         logAction(`Error occurred`, 'error', { error: err.message, stack: err.stack })
         handleError(err, req, res, next)
       })
       ```
     - Added logging to the welcome route:
       ```javascript
       app.use('/', (req, res) => {
         logAction(`Welcome request received`, 'info', { ip: req.ip })
         res.send('Welcome to API server!!').status(200).end()
       })
       ```
   - Purpose: Integrate the new logging system into the main application file for better monitoring and debugging.

### Additional Information

1. Dependencies:
   - Added Winston as a new dependency. Installation command:
     ```bash
     npm install winston
     ```
     or
     ```bash
     yarn add winston
     ```

2. Logging Levels:
   - The logging system uses the following levels (in order of severity):
     error, warn, info, http, verbose, debug, silly

3. Log Files:
   - `error.log`: Contains only error-level logs
   - `combined.log`: Contains all logs regardless of level

4. Next Steps:
   - Integrate logging into individual route handlers and services for more detailed application monitoring.
   - Consider adding log rotation to manage log file sizes in a production environment.

5. Security Note:
   - Ensure that sensitive information (e.g., user data, passwords) is not logged to prevent security risks.

6. Performance Consideration:
   - While logging is crucial for monitoring and debugging, excessive logging might impact application performance. Monitor and adjust logging levels as needed in production.

## Firebase Authentication Flow and Login Process

### Overview
This document outlines the authentication flow using Firebase and the interaction between the client and server for user login in our MERN blog project.

### Firebase Authentication Flow

1. **Client-Side Setup**
   - Firebase SDK is initialized in the client application (`client/src/firebase.js`).
   - Configuration details are stored in environment variables for security.

2. **User Interaction**
   - User clicks the "Sign in with Google" button in the OAuth component (`client/src/components/OAuth.jsx`).

3. **Firebase Authentication**
   - The `signInWithPopup` method from Firebase is called with a Google Auth Provider.
   - Firebase handles the OAuth flow, including opening a popup for Google login.

4. **Token Reception**
   - Upon successful authentication, Firebase returns a credential object containing user information and tokens.

5. **Server Communication**
   - The client extracts relevant user data (name, email, profile picture URL) from the Firebase response.
   - This data is sent to our server's `/api/auth/signInWithGoogle` endpoint.

### Server-Side Authentication Process

1. **Endpoint Handler** (`api/controllers/auth.controller.js`)
   - The server receives the user data from the client.
   - It checks if a user with the provided email already exists in the database.

2. **Existing User Flow**
   - If the user exists, the server generates a JWT token for the session.
   - User information (excluding password) and the token are sent back to the client.

3. **New User Flow**
   - If the user doesn't exist, a new user record is created in the database.
   - A temporary password is generated (for potential future email/password login).
   - A JWT token is generated for the new user.
   - User information and token are sent back to the client.

4. **Token Storage**
   - The server sets the JWT token as an HTTP-only cookie for security.

### Client-Side Post-Authentication

1. **State Update**
   - Upon receiving the server response, the client updates the user state using Zustand store (`client/src/services/zustandStore/userStore.jsx`).

2. **Navigation**
   - The user is redirected to the home page or a dashboard.

3. **Persistent Login**
   - The JWT token in the HTTP-only cookie allows the user to remain authenticated across sessions.

### Security Considerations

1. **Token Security**
   - JWTs are stored as HTTP-only cookies to prevent XSS attacks.
   - Tokens are verified on the server for each protected request.

2. **Firebase Rules**
   - Firebase Storage rules are implemented to restrict unauthorized access and limit upload sizes.

3. **Environment Variables**
   - Sensitive information like API keys are stored in environment variables, not in the codebase.

### Code Snippets

1. Firebase Initialization (`client/src/firebase.js`):
   ```javascript
   import { initializeApp } from "firebase/app";
   
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     // ... other config properties
   };
   
   export const app = initializeApp(firebaseConfig);
   ```

2. Google Sign-In (`client/src/components/OAuth.jsx`):
   ```javascript
   const handleGoogleAuthClick = async () => {
     const auth = getAuth(app);
     const provider = new GoogleAuthProvider();
     try {
       const result = await signInWithPopup(auth, provider);
       // ... handle result and send to server
     } catch (error) {
       console.error('Google sign-in error:', error);
     }
   };
   ```

3. Server-Side Authentication (`api/controllers/auth.controller.js`):
   ```javascript
   export const signInWithGoogle = async (req, res, next) => {
     const { name, email, googlePhotoUrl } = req.body;
     try {
       let user = await User.findOne({ email });
       if (!user) {
         // Create new user
         user = new User({ /* user details */ });
         await user.save();
       }
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
       res.cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(user);
     } catch (error) {
       next(error);
     }
   };
   ```

### Future Improvements

1. Implement refresh tokens for enhanced security.
2. Add option for email/password authentication alongside Google OAuth.
3. Introduce multi-factor authentication for sensitive operations.

This authentication flow provides a secure and user-friendly way to handle user login using Firebase and our custom server implementation.