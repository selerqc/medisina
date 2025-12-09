import multer from 'multer';
import ApiError from '#utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',

    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new ApiError(
      `Invalid file type: ${file.mimetype}. Only images, PDFs, Word documents, Excel files, and text files are allowed.`,
      StatusCodes.BAD_REQUEST
    );
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Too many files. Maximum is 5 files per request.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Unexpected field in file upload.'
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message
    });
  }

  if (err) {
    return res.status(err.statusCode || StatusCodes.BAD_REQUEST).json({
      message: err.message || 'File upload error'
    });
  }

  next();
};

export default upload;
