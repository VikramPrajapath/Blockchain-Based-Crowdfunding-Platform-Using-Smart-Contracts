import React, { useContext } from 'react';
import styled from 'styled-components';
import { TailSpin } from 'react-loader-spinner';
import { FormState } from '../Form';

const FormRightWrapper = () => {
  const { ImageHandler, FormHandler, form, uploadLoading, setUploadLoading, uploaded, setUploaded, uploadFiles, startCampaign } = useContext(FormState);

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input
              onChange={FormHandler}
              value={form.requiredAmount}
              name="requiredAmount"
              type="number"
              placeholder="Required Amount"
            />
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              onChange={FormHandler}
              value={form.category}
              name="category"
            >
              <option value="">Select a category</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Animal">Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      <FormInput>
        <label>Select Image</label>
        <Image
          alt="Upload"
          onChange={ImageHandler}
          type="file"
          accept="image/*"
        />
      </FormInput>
      {uploadLoading ? (
        <Button disabled>
          <TailSpin color="#fff" height={20} />
        </Button>
      ) : uploaded ? (
        <Button disabled style={{ cursor: 'no-drop' }}>
          Files uploaded Successfully
        </Button>
      ) : (
        <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
      )}
      <Button onClick={startCampaign}>Start Campaign</Button>
    </FormRight>
  );
};

// ... (the rest of the code remains the same)
const FormRight = styled.div`
  width: 45%;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'poppins';
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const RowFirstInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const RowSecondInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Select = styled.select`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const Image = styled.input`
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline: none;
    border: none;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
`;

export default FormRightWrapper;