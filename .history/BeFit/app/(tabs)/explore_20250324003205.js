import { StyleSheet, Image, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, Alert } from 'react-native';
//import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    photo: '',
  });

  // Fetch user data from MongoDB
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('http://10.138.217.191:3000/profile'); // Replace with your backend URL
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  // // Handle image selection
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setUserProfile({ ...userProfile, photo: result.assets[0].uri });
  //   }
  // };

  // Save profile updates to MongoDB
  const saveProfile = async () => {
    try {
      const response = await fetch('http://10.138.217.191:3000/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <ScrollView>//
      <ThemedView style={styles.profileHeader}>
        {/* <TouchableOpacity onPress={pickImage}>
          {userProfile.photo ? (
            <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
          ) : (
            <IconSymbol name="person.circle.fill" size={150} color="#808080" />
          )}
        </TouchableOpacity> */}

        <TextInput
          style={styles.input}
          value={userProfile.username}
          onChangeText={(text) => handleInputChange('username', text)}
          placeholder="Enter username"
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={userProfile.bio}
          onChangeText={(text) => handleInputChange('bio', text)}
          placeholder="Enter bio"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
  },
  multilineInput: {
    height: 60,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
