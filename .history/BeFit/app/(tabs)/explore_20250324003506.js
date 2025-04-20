import { StyleSheet, Image, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    photo: '',
  });

  const userId = 'USER_ID_HERE'; // Replace with dynamic user ID after login

  // Fetch user data from MongoDB
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return; // Prevent fetching if userId is missing

      try {
        const response = await fetch(`http://10.138.217.191:3000/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Could not load profile data.');
      }
    }

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  // Save profile updates to MongoDB
  const saveProfile = async () => {
    try {
      const response = await fetch(`http://10.138.217.191:3000/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  return (
    <ScrollView>
      <ThemedView style={styles.profileHeader}>
        {/* Profile Image */}
        <TouchableOpacity>
          {userProfile.photo ? (
            <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
          ) : (
            <IconSymbol name="person.circle.fill" size={150} color="#808080" />
          )}
        </TouchableOpacity>

        {/* Username Input */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userProfile.username}
          onChangeText={(text) => handleInputChange('username', text)}
          placeholder="Enter username"
          placeholderTextColor="#666"
        />

        {/* Bio Input */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={userProfile.bio}
          onChangeText={(text) => handleInputChange('bio', text)}
          placeholder="Enter bio"
          placeholderTextColor="#666"
          multiline
        />

        {/* Save Button */}
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
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
