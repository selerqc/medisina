import pc from 'picocolors'

const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO]  ${pc.green(message)}`, meta ? pc.italic(JSON.stringify(meta)) : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN]  ${pc.gray(message)}`, meta ? pc.italic(JSON.stringify(meta)) : '');
  },
  error: (message, meta = '') => {
    console.error(`[ERROR]  ${pc.red(message)}`, meta ? pc.italic(JSON.stringify(meta)) : '');
  },
  debug: (message, meta = '') => {
    console.debug(`[DEBUG]  ${pc.magenta(message)}`, meta ? pc.italic(JSON.stringify(meta)) : '');
  }
};

export default logger;


/*example

Info logging
logger.info('User login successful', { userId: 123, email: 'user@example.com' });

 Warning logging
logger.warn('Password reset attempt for non-existent user', { email: 'fake@example.com' });

Error logging
logger.error('Database connection failed', { 
  error: error.message, 
  stack: error.stack 
});


*/