import React from 'react';
import { Alert } from 'react-native';
import AuthorizedPersonForm from '../../components/AuthorizedPersonForm';
import {
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useUploadPersonImageMutation,
  useEncodePersonMutation,
} from '../../store/apiSlice';
import {BASE_URL} from '../../store/apiSlice'

const EditAuthorizedPersonScreen = ({ navigation,route }) => {
  const { person, propertyId } = route.params;
  const [updatePerson] = useUpdatePersonMutation();
  const [deletePerson] = useDeletePersonMutation();
  const [uploadImage] = useUploadPersonImageMutation();
  const [encodePerson] = useEncodePersonMutation();
 
  const initialValues = {
    fullName: person.name,
    role: person.role,
    // Map server URLs back to { front, left, right } for display
    photos: {
      front: person.photo_urls?.[0] ? `${BASE_URL}${person.photo_urls[0]}` : null,
      left: person.photo_urls?.[1] ? `${BASE_URL}${person.photo_urls[1]}` : null,
      right: person.photo_urls?.[2] ? `${BASE_URL}${person.photo_urls[2]}` : null,
    },
  };
 
  const handleSubmit = async ({ fullName, role, photos }) => {
    try {
      const photoUrls = [];
      for (const [side, uri] of Object.entries(photos)) {
        if (!uri) continue;
        // If it's already a server URL (starts with http), keep it
        if (uri.startsWith('http')) {
          const path = new URL(uri).pathname;
          photoUrls.push(path);
        } else {
          const formData = new FormData();
          formData.append('file', { uri, name: `${side}.jpg`, type: 'image/jpeg' });
          const res = await uploadImage(formData).unwrap();
          photoUrls.push(res.url);
        }
      }
 
      await updatePerson({
        personId: person.id,
        propertyId,
        name: fullName,
        role,
        photo_urls: photoUrls,
      }).unwrap();
      Alert.alert('Success', 'Person updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.data?.detail || 'Failed to update person.');
    }
  };
 
  const handleDelete = () => {
    Alert.alert('Delete Person', `Delete ${person.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePerson({ personId: person.id, propertyId }).unwrap();
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Failed to delete person.');
          }
        },
      },
    ]);
  };

  return (
    <AuthorizedPersonForm
      title="Edit Person"
      submitButtonText="UPDATE PERSON"
      initialValues={initialValues}
      onBack={() => navigation.goBack()}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
};

export default EditAuthorizedPersonScreen;