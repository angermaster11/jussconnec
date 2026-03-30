import multer from 'multer';
import { errorResponse } from '../utils/apiResponse.js';

// Store in memory for Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
  const allowedDocTypes = ['application/pdf'];

  const allAllowed = [...allowedImageTypes, ...allowedVideoTypes, ...allowedDocTypes];

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

export const uploadSingle = (fieldName) => (req, res, next) => {
  const uploadHandler = upload.single(fieldName);
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, 'File size exceeds 50MB limit.', 400);
      }
      return errorResponse(res, `Upload error: ${err.message}`, 400);
    }
    if (err) {
      return errorResponse(res, err.message, 400);
    }
    next();
  });
};

export const uploadMultiple = (fieldName, maxCount = 10) => (req, res, next) => {
  const uploadHandler = upload.array(fieldName, maxCount);
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, 'File size exceeds limit.', 400);
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return errorResponse(res, `Too many files. Max: ${maxCount}`, 400);
      }
      return errorResponse(res, `Upload error: ${err.message}`, 400);
    }
    if (err) {
      return errorResponse(res, err.message, 400);
    }
    next();
  });
};
