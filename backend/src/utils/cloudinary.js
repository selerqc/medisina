import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';
import ApiError from './ApiError.js';
import { StatusCodes } from 'http-status-codes';

cloudinary.config({
  cloud_name: config.cloudinary.CLOUDINARY_CLOUD_NAME,
  api_key: config.cloudinary.CLOUDINARY_API_KEY,
  api_secret: config.cloudinary.CLOUDINARY_API_SECRET,
});

export async function uploadFileToCloudinary(file, patientId, publicId) {
  if (!file) throw new ApiError('No file provided', StatusCodes.BAD_REQUEST);

  const fileToUpload = file.buffer
    ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    : file.path;

  const folderPath = `medisync_uploads/health_records/${patientId}`;

  const getFileExtension = () => {
    if (file.originalname) {
      const ext = file.originalname.split('.').pop();
      if (ext && ext !== file.originalname) return ext;
    }
    const mimeExtMap = {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif'
    };
    return mimeExtMap[file.mimetype] || 'bin';
  };

  const fileExtension = getFileExtension();
  const publicIdWithExt = `${publicId}.${fileExtension}`;

  const isImage = file.mimetype?.startsWith('image/');
  const resourceType = isImage ? 'image' : 'raw';

  const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
    folder: folderPath,
    public_id: publicIdWithExt,
    resource_type: resourceType,
    overwrite: false,
    type: 'upload',
    access_mode: 'public',
    // Force proper content type
    format: fileExtension
  });

  return uploadResult;
}

export default cloudinary;







