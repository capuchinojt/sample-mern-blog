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