import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function NewPost() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to take a photo.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    // TODO: Upload `image` to backend and add caption input
    console.log('Post image:', image);
    Alert.alert('Post submitted!');
    router.back(); // Go back to feed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonGroup}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Choose from Gallery" onPress={pickImage} />
        {image && <Button title="Post" onPress={handlePost} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
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
  buttonGroup: {
    gap: 10,
  },
});
