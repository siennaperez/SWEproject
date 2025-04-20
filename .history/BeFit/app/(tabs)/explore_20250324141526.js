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
    followers: 10, // Placeholder for now
    friends: 10, // Placeholder for now
  });

  const [isEditing, setIsEditing] = useState(false);
  const userId = db.getUser(userName); //find a way to get userid

  // Fetch user data from MongoDB
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;

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

      console.log(userId)

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false); // Exit edit mode after saving
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
            style={styles.input}
            value={userProfile.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter username"
            placeholderTextColor="#666"
          />
        ) : (
          <ThemedText type="title" style={styles.username} onPress={() => setIsEditing(true)}>
            {userProfile.username || 'Username'}
          </ThemedText>
        )}

        {/* Bio (Editable) */}
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.multilineInput]}
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
});
