import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/explore'); // Adjust the URL as needed
        const data = await response.json();
        if (response.ok) {
          setDisplayName(data.displayName);
          setBio(data.bio);
          setProfilePhoto(data.profilePhoto);
        } else {
          Alert.alert('Error', data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/explore', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio, profilePhoto }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Photo URL"
        value={profilePhoto}
        onChangeText={setProfilePhoto}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    padding: 20, // Add padding around the content
    backgroundColor: '#FFFFFF', // Background color
  },
  input: {
    width: '100%', // Full width
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '100%', // Full width
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProfileScreen;