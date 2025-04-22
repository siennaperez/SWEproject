import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useUser } from './(login)/userContext';
import { getIpAddress } from './(login)/ipConfig'; 

export default function NewPost() {
  const { userId } = useUser();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ip = getIpAddress();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to take a photo.');
      return false;
    }

    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus !== 'granted') {
      Alert.alert('Permission required', 'Gallery permission is required to pick a photo.');
      return false;
    }

    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('caption', caption);
  
      // Append the image file from URI
      formData.append('image', {
        uri: image,
        name: 'image.jpg',  // You can set the file name dynamically
        type: 'image/jpeg',
      });
        const now = new Date();
      const createdAtFormatted = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const response = await fetch(`${ip}/posts`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify({
          userId: userId,
          imageUrl,
          caption,
          createdAtFormatted,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Post created successfully!');
        router.back();  // Go back to feed
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', `Failed to create post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a New Post</Text>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={3}
        />

        <View style={styles.buttonGroup}>
          <Button title="Take Photo" onPress={takePhoto} disabled={loading} />
          <Button title="Choose from Gallery" onPress={pickImage} disabled={loading} />
          {image && <Button title={loading ? "Posting..." : "Post"} onPress={handlePost} disabled={loading} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    gap: 10,
    width: '100%',
  },
});
