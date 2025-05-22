import crypto from 'crypto';

const CLOUD_NAME = 'dbw3ozdoh';
const API_KEY = '742373231915158';
const API_SECRET = 'rlJxEB-nHt5b6dIywf57q_fc0iE';

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

export const uploadImageToCloudinary = (file: File): Promise<string> => {
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