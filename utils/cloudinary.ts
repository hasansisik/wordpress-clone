import crypto from 'crypto';
import axios from 'axios';
import { server } from '@/config';

// Default values
let CLOUD_NAME = 'dbw3ozdoh';
let API_KEY = '742373231915158';
let API_SECRET = 'rlJxEB-nHt5b6dIywf57q_fc0iE';

// Function to fetch Cloudinary settings from the server
export const fetchCloudinarySettings = async (): Promise<void> => {
  try {
    const response = await axios.get(`${server}/general`);
    const { cloudinary } = response.data;
    
    if (cloudinary) {
      CLOUD_NAME = cloudinary.cloudName || CLOUD_NAME;
      API_KEY = cloudinary.apiKey || API_KEY;
      API_SECRET = cloudinary.apiSecret || API_SECRET;
    }
  } catch (error) {
    console.error('Error fetching Cloudinary settings:', error);
    // If there's an error, use the default values
  }
};

// Call this function early in your app's lifecycle
fetchCloudinarySettings();

function generateSignature(timestamp: number): string {
  const str = `timestamp=${timestamp}${API_SECRET}`;
  return crypto.createHash('sha1').update(str).digest('hex');
}

interface UploadResult {
  info: {
    public_id: string;
    secure_url: string;
  };
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Refresh settings before upload to ensure we have the latest
  await fetchCloudinarySettings();
  
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.secure_url);
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        reject(error);
      });
  });
};