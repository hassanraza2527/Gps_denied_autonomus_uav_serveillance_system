import React from 'react';
import { Alert } from 'react-native';
import AuthorizedPersonForm from '../../components/AuthorizedPersonForm';
import { useCreatePersonMutation, useUploadPersonImageMutation, useEncodePersonMutation } from '../../store/apiSlice';

const AddAuthorizedPersonScreen = ({ navigation,route }) => {
  const propertyId = route?.params?.propertyId;
  const [createPerson] = useCreatePersonMutation();
  const [uploadImage] = useUploadPersonImageMutation();
  const [encodePerson] = useEncodePersonMutation();
 
  const handleSubmit = async ({ fullName, role, photos }) => {
    try {
      // 1. Upload each photo and collect server URLs
      const photoUrls = [];
      for (const [side, uri] of Object.entries(photos)) {
        if (!uri) continue;
        const formData = new FormData();
        formData.append('file', { uri, name: `${side}.jpg`, type: 'image/jpeg' });
        const res = await uploadImage(formData).unwrap();
        photoUrls.push(res.url);
      }
 
      // 2. Create the person record
      const result = await createPerson({
        propertyId,
        name: fullName,
        role,
        photo_urls: photoUrls,
      }).unwrap();
 
      Alert.alert('Success', 'Person added!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.data?.detail || 'Failed to add person.');
    }
  };
  return (
     <AuthorizedPersonForm
      title="Add Authorized Person"
      submitButtonText="SAVE PERSON"
      onBack={() => navigation.goBack()}
      onSubmit={handleSubmit}
    />
  );
};

export default AddAuthorizedPersonScreen;