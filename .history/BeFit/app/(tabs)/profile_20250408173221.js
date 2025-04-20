import { StyleSheet, Image, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUser } from '../(login)/userContext';
import { ImagePicker } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ProfileScreen() {
  const { userId } = useUser();
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    photo: '',
    numberOfPosts: 0,
    friends: 0,
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data from MongoDB
  useEffect(() => {
    console.log('Current User ID:', userId); // Debug log

    if (!userId) {
      Alert.alert('Error', 'No user ID found. Please log in again.');
      return;
    }

    async function fetchProfile() {
      try {
        const response = await fetch(`http://10.138.217.191:3000/profile/${userId}`);
        console.log('Response:', response); // Debug log

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Fetched Profile Data:', data); // Debug log
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
      console.log('Saving profile with data:', {
        username: userProfile.username,
        bio: userProfile.bio,
        photo: userProfile.photo
      });
      
      const response = await fetch(`http://10.138.217.191:3000/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userProfile.username,
          bio: userProfile.bio,
          photo: userProfile.photo
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Could not update profile.');
    }
  };

  return (
    <ScrollView>
      {/* Profile Header */}
      <ThemedView style={styles.profileHeader}>
        {/* Profile Image */}
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          {userProfile.photo ? (
            <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
          ) : (
            <IconSymbol name="person.circle.fill" size={150} color="#808080" />
          )}
        </TouchableOpacity>

        {/* Username (Editable) */}
        {isEditing ? (
          <TextInput
            style={[styles.input, { color: '#FFFFFF' }]}
            value={userProfile.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter username"
            placeholderTextColor="#FFFFFF"
          />
        ) : (
          <ThemedText type="title" style={styles.username} onPress={() => setIsEditing(true)}>
            {userProfile.username || 'Username'}
          </ThemedText>
        )}

        {/* Bio (Editable) */}
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.multilineInput, {color: '#FFFFFF'}]}
            value={userProfile.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            placeholder="Enter bio"
            placeholderTextColor="#666"
            multiline
          />
        ) : (
          <ThemedText type="default" style={styles.bio} onPress={() => setIsEditing(true)}>
            {userProfile.bio || 'Tap to add a bio!'}
          </ThemedText>
        )}

        {/* Follower & Friends Count */}
        <SafeAreaView style={styles.followingHeaderContainer}>
          <ThemedText type="defaultSemiBold">Posts</ThemedText>
          <ThemedText type="defaultSemiBold">Friends</ThemedText>
        </SafeAreaView>
        <SafeAreaView style={styles.followerNumbersContainer}>
          <ThemedText type="defaultSemiBold">{userProfile.followers}</ThemedText>
          <ThemedText type="defaultSemiBold">{userProfile.friends}</ThemedText>
        </SafeAreaView>

        {/* Save Button (Only visible when editing) */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Bio Section */}
      <ThemedView style={styles.bioSection}>
        <ThemedText style={styles.sectionTitle}>Bio</ThemedText>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={userProfile.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#808080"
          />
        ) : (
          <ThemedText style={styles.bioText} onPress={() => setIsEditing(true)}>
            {userProfile.bio || 'Add a bio'}
          </ThemedText>
        )}
      </ThemedView>

      {/* Save button when editing */}
      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProfile}
        >
          <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  bio: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  followingHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  followerNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '67%',
    marginBottom: 25,
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
  bioSection: {
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bioInput: {
    height: 100,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  bioText: {
    fontSize: 16,
    color: '#808080',
    padding: 12,
  },
});