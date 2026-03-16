const crypto = require('crypto');

const parseCloudinaryUrl = () => {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (!cloudinaryUrl) {
    return null;
  }

  try {
    const parsed = new URL(cloudinaryUrl);
    return {
      cloudName: parsed.hostname,
    };
  } catch {
    return null;
  }
};

const getCloudinaryConfig = () => {
  const parsed = parseCloudinaryUrl();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || parsed?.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
};

const isDataUrl = (value) => typeof value === 'string' && /^data:[^;]+;base64,/.test(value);

const createSignature = (params, apiSecret) => {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
};

const uploadDataUrl = async (dataUrl, options = {}) => {
  const config = getCloudinaryConfig();

  if (!config) {
    throw new Error('Cloudinary is not configured.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: options.folder || 'lineup',
    public_id: options.publicId,
    timestamp,
  };
  const signature = createSignature(params, config.apiSecret);
  const formData = new FormData();

  formData.set('file', dataUrl);
  formData.set('api_key', config.apiKey);
  formData.set('timestamp', String(timestamp));
  formData.set('signature', signature);
  formData.set('folder', params.folder);

  if (params.public_id) {
    formData.set('public_id', params.public_id);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Cloudinary upload failed.');
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width,
    height: payload.height,
    format: payload.format,
  };
};

module.exports = {
  getCloudinaryConfig,
  isDataUrl,
  uploadDataUrl,
};
