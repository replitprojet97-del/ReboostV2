import cloudinary from './config/cloudinary';
import { cloudinaryConfigured } from './config/cloudinary';
import path from 'path';

async function uploadLogo() {
  if (!cloudinaryConfigured) {
    console.error('Cloudinary is not configured. Please check your environment variables.');
    process.exit(1);
  }

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'logo_solventis_1768330385041.png');
    console.log('Uploading logo from:', logoPath);
    
    const result = await cloudinary.uploader.upload(logoPath, {
      public_id: 'solventis-email-logo',
      folder: 'solventis_assets',
      overwrite: true,
      resource_type: 'image'
    });
    
    console.log('Upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('Secure URL:', result.secure_url);
    process.exit(0);
  } catch (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }
}

uploadLogo();
