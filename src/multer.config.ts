import { diskStorage } from 'multer';
import { extname } from 'path';
import * as moment from 'moment';
import * as fs from 'fs';
import { env } from 'process';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      // Create a directory structure based on the current date
      const now = moment(); // Get the current date
      const year = now.format('YYYY');
      const month = now.format('MM'); // Month is 1-based (01-12)
      const day = now.format('DD'); // Day is 1-based (01-31)

      const dir = process.env.UPLOADS_DIR + `${year}/${month}/${day}`; // Set the upload path

      // Create the directory if it doesn't exist
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.error('Failed to create directory:', err);
          return callback(err, dir); // Call callback with error
        }
        callback(null, dir); // Set the destination
      });
    },
    filename: (req, file, callback) => {
      // Replace spaces with underscores in the original name
      const originalName = file.originalname.replace(/\s+/g, '_').toLowerCase();
      // Use only the original filename
      callback(null, originalName); // Store the file with the original name
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/; // Allowed file types
    const isValid = allowedTypes.test(extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
    callback(null, isValid);
  },
};

