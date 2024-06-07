// utils.js
import axios from 'axios';

// Environment variables to securely pass the Pinata keys
const pinataApiKey = '9f24509800ddf04b9d53';
const pinataSecretApiKey = '2744e8effb341faffa80224bbb67714130fafab280cf8058115de29923ba6350';

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