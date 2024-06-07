// utils.js
import axios from 'axios';

// Environment variables to securely pass the Pinata keys
const pinataApiKey = 'PASTE API KEY';
const pinataSecretApiKey = 'PASTE SECRET API KEY';

export const uploadToIPFS = async (formData) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const { IpfsHash } = response.data;
    const fileUrl = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
