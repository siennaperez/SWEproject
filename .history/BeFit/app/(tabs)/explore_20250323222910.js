// profile page
import { StyleSheet, Image, Platform,View, ScrollView, SafeAreaView} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';


const ProfileScreen = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user'); // Adjust the URL as needed
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
      const response = await fetch('http://localhost:3000/user', {
        method: 'PUT', // Use PUT for updating user data
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
    <View>
      <TextInput
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        placeholder="Profile Photo URL"
        value={profilePhoto}
        onChangeText={setProfilePhoto}
      />
      <TouchableOpacity onPress={handleSave}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

  {/*IDEALLY GRID?!!*/}



const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 100,
    marginBottom: 20,
  },
  profileContainer:{
    width:150,
    height:150,
    borderRadius: 90,
    marginBottom: 55,
  },
  followingHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  followerNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '67%',
    marginBottom: 25,
  },
});
