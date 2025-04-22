import { StyleSheet, Image, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useUser } from '../(login)/userContext';
import { setUserId } from '../(login)/userContext';
import * as ImagePicker from 'expo-image-picker';
import { getIpAddress } from '../(login)/ipConfig'; 

export default function ProfileScreen() {
  const router = useRouter();
  const { userId } = useUser();
  const { setUserId } = useUser();
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    photo: '',
    numberOfPosts: 0,
    friends: 0,
  });
  const ip = getIpAddress();
  
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data from MongoDB
  useEffect(() => {
    console.log('Current User ID:', userId); // Debug log

    if (!userId) {
      Alert.alert('Error', 'No user ID found. Please log in again.');
      return;
    }

    async function fetchProfile() {
      try {
        const response = await fetch(`${ip}/profile/${userId}`);
        console.log('Response:', response); // Debug log

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Fetched Profile Data:', data); // Debug log

        console.log('Number of Posts:', data.numberOfPosts); 
        setUserProfile({
          username: data.username,
          bio: data.bio,
          photo: data.photo,
          numberOfPosts: data.numberOfPosts, 
          friends: data.friends,
        });
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
      const response = await fetch(`${ip}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,  // Ensure the userId is included
          name: userProfile.username,  // Pass username as name
          bio: userProfile.bio,  // Include the bio field
          profilePhoto: userProfile.photo,  // Include the photo URL
        }),
      });
  
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

  const [userPosts, setUserPosts] = useState([]);

useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${ip}/posts/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user posts');
      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  if (userId) {
    fetchUserPosts();
  }
}, [userId]);

const requestPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted' || galleryStatus !== 'granted') {
    Alert.alert('Permission required', 'Camera and gallery permissions are required.');
    return false;
  }

  return true;
};

const changeProfilePhoto = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: false,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setUserProfile({ ...userProfile, photo: uri });
  }
};

const maxWords = 25;  // Set a limit for the number of words in the bio

// Function to count words
const countWords = (text) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Handle bio input change with word limit check
const handleBioChange = (text) => {
  const wordCount = countWords(text);
  if (wordCount <= maxWords) {
    setUserProfile({ ...userProfile, bio: text });  // Update bio if word count is within limit
  } else {
    Alert.alert('Limit Reached', `You can only enter up to ${maxWords} words.`);
  }
};

const handleLogout = () => {
  setUserId(null); 
  // setForceRender(prev => !prev); 
  router.push('/login'); // Assuming your login screen is at '/login'
};

const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([
    (async () => {
      try {
        const response = await fetch(`${ip}/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUserProfile({
          username: data.username,
          bio: data.bio,
          photo: data.photo,
          numberOfPosts: data.numberOfPosts,
          friends: data.friends,
        });
      } catch (error) {
        console.error('Error refreshing profile:', error);
        Alert.alert('Error', 'Could not refresh profile.');
      }
    })(),
    (async () => {
      try {
        const response = await fetch(`${ip}/posts/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error('Error refreshing posts:', error);
      }
    })()
  ]);
  setRefreshing(false);
};


//exports for the app, basically all formatting
return (
  //scroll view is the entire profile, the posts and editable personal info will scroll
 <ScrollView 
  contentContainerStyle={{ paddingBottom: 100 }}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  >
    {/* profile section */}
    <ThemedView style={styles.profileHeader}>
      {/* profile photo with react image picker */}
      <TouchableOpacity onPress={isEditing ? changeProfilePhoto : () => setIsEditing(true)}>
        {userProfile.photo ? (
          <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
        ) : (
          <IconSymbol name="person.circle.fill" size={150} color="#808080" />
        )}
      </TouchableOpacity>

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

    {isEditing ? (
      <TextInput
        style={[styles.input, styles.multilineInput, { color: '#FFFFFF' }]}
        value={userProfile.bio}
        onChangeText={handleBioChange} 
        placeholder="Enter bio"
        placeholderTextColor="#666"
        multiline
      />
    ) : (
      <ThemedText type="default" style={styles.bio} onPress={() => setIsEditing(true)}>
        {userProfile.bio || 'Tap to add a bio!'}
      </ThemedText>
    )}

    <SafeAreaView style={styles.followingHeaderContainer}>
      <ThemedText type="defaultSemiBold">Posts</ThemedText>
      <ThemedText type="defaultSemiBold">Friends</ThemedText>
    </SafeAreaView>
    <SafeAreaView style={styles.followerNumbersContainer}>
      <ThemedText type="defaultSemiBold">{userProfile.numberOfPosts}</ThemedText>
      <ThemedText type="defaultSemiBold">{userProfile.friends}</ThemedText>
    </SafeAreaView>

    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
    </TouchableOpacity>

    {isEditing && (
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    )}
  </ThemedView>


  {userPosts.map((item) => (
    <ThemedView key={item._id} style={feedStyles.postContainer}>
      <Text style={feedStyles.username}>{item.userId?.username || 'Unknown User'}</Text>
      <Image source={{ uri: item.imageUrl }} style={feedStyles.postImage} />
      {item.caption && <Text style={feedStyles.caption}>{item.caption}</Text>}
      <Text style={feedStyles.timestamp}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </ThemedView>
  ))}

  <TouchableOpacity
    style={feedStyles.button}
    onPress={() => router.push('/new-post')}
  >
    <Text style={feedStyles.buttonText}>+ Create Post</Text>
  </TouchableOpacity>
</ScrollView>

  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 5,
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
    width: '72%',
    marginBottom: 15,
  },
  personalPostContainer:{
    alignItems: 'center',
    color:'#ffffff', 


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
  logoutButton: {
    backgroundColor: 'white', 
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '100%',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '780',
  }
});

const feedStyles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 150,
    width: '100%',
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    marginHorizontal: 0,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  caption: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  button: {
    backgroundColor: '#1F51FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center', 
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
