import styled from 'styled-components';
import FormLeftWrapper from './Components/FormLeftWrapper';
import FormRightWrapper from './Components/FormRightWrapper';
import { createContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import axios from 'axios';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json';
import { uploadToIPFS } from '../Form/utils';

const FormState = createContext();

const Form = () => {
  const [form, setForm] = useState({
    campaignTitle: '',
    story: '',
    requiredAmount: '',
    category: 'education',
  });

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const [storyUrl, setStoryUrl] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [image, setImage] = useState(null);

  const FormHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const ImageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const [uploadLoading, setUploadLoading] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (!image) {
      toast.error('No image selected');
      setUploadLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', image);

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': '9f24509800ddf04b9d53',
          'pinata_secret_api_key': '2744e8effb341faffa80224bbb67714130fafab280cf8058115de29923ba6350',
        },
        
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const { IpfsHash } = response.data;
      setImageUrl(`${IpfsHash}`);
      setUploaded(true);
      toast.success('File Uploaded Successfully to IPFS');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const startCampaign = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) {
        toast.error("Ethereum object not found, make sure you have MetaMask installed.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (form.campaignTitle === '') {
        toast.warn('Title Field Is Empty');
        return;
      }
      if (form.story === '') {
        toast.warn('Story Field Is Empty');
        return;
      }
      if (form.requiredAmount === '') {
        toast.warn('Required Amount Field Is Empty');
        return;
      }
      if (!image) {
        toast.warn('Image File is Required');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('file', image);

      // Upload image file to IPFS and get the file URL
      const imageUrl = await uploadToIPFS(formData);
      if (!imageUrl) {
        toast.error("Failed to upload image to IPFS");
        setLoading(false);
        return;
      }

      setImageUrl(imageUrl); // Save the URL state if needed later

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        signer
      );

      const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);

      const campaignData = await contract.createCampaign(
        form.campaignTitle,
        CampaignAmount,
        imageUrl,
        form.category,
        storyUrl || ""
      );
  
      const receipt = await campaignData.wait();
        // Check for the campaignCreated event and retrieve the campaign address
        const campaignCreatedEvent = receipt.events?.find(event => event.event === 'campaignCreated');
        const campaignAddress = campaignCreatedEvent?.args?.campaignAddress;
  
        if (campaignAddress) {
          setAddress(campaignAddress);
          setUploaded(true);
        } else {
          // If the campaign address is not found, try retrieving it directly from the contract
          const deployedCampaigns = await contract.getDeployedCampaigns();
          const latestCampaignAddress = deployedCampaigns[deployedCampaigns.length - 1];
          setAddress(latestCampaignAddress);
          setUploaded(true);
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error starting campaign:', error);
        toast.error('An error occurred while starting the campaign. Please try again.');
        setLoading(false);
      }
    };
  return (
    <FormState.Provider
      value={{
        form,
        setForm,
        image,
        setImage,
        ImageHandler,
        FormHandler,
        setImageUrl,
        setStoryUrl,
        startCampaign,
        setUploaded,
        uploadLoading,
        setUploadLoading,
        uploaded,
        setUploaded,
        uploadFiles,
      }}
    >
      <FormWrapper>
        <FormMain>
          {loading ? (
            address === '' ? (
              <Spinner>
                <TailSpin height={60} />
              </Spinner>
            ) : (
              <Address>
                <h1>Campagin Started Sucessfully!</h1>
                <h1>{address}</h1>
                <Button>Go To Campaign</Button>
              </Address>
            )
          ) : (
            <FormInputsWrapper>
              <FormLeftWrapper />
              <FormRightWrapper />
            </FormInputsWrapper>
          )}
        </FormMain>
      </FormWrapper>
    </FormState.Provider>
  );
};

const FormWrapper = styled.div`
    width: 100%;
    display:flex;
    justify-content:center;
`

const FormMain = styled.div`
    width:80%;
`

const FormInputsWrapper = styled.div`
    display:flex;
    justify-content:space-between ;
    margin-top:45px ;
`

const Spinner = styled.div`
    width:100%;
    height:80vh;
    display:flex ;
    justify-content:center ;
    align-items:center ;
`
const Address = styled.div`
    width:100%;
    height:80vh;
    display:flex ;
    display:flex ;
    flex-direction:column;
    align-items:center ;
    background-color:${(props) => props.theme.bgSubDiv} ;
    border-radius:8px;
`

const Button = styled.button`
    display: flex;
  justify-content:center;
  width:30% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`

export default Form;
export {FormState}; 