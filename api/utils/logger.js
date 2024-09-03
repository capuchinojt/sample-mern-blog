// Import the Winston library for logging
import winston from 'winston'

const { combine, timestamp, printf, colorize, align } = winston.format
// Create a logger instance with custom configuration
const logger = winston.createLogger({
  // Set the default logging level
  level: 'info',
  // Configure the log format to include timestamp and use JSON format
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => {
      const { timestamp, level, message, ...metadata } = info;
      return `[${timestamp}] ${level}: ${message} ${Object.keys(metadata).length > 0 ? ' - ' + JSON.stringify(metadata) : ''}`
    })
  ),
  // Define multiple transports (output destinations) for logs
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log errors to a separate file
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Log all levels to a combined file
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Helper function to log actions with optional metadata
export function logAction(action, level = 'info', metadata = {}) {
  logger.log({
    level,
    message: `Action: ${action}`,
    ...metadata,
  });
}

// Export the logger instance for use in other modules
export default logger