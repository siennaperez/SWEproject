import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { getIpAddress } from '../(login)/ipConfig'; 
import { useUser } from '../(login)/userContext';
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Adjust import path based on your file structure
import { ThemedView } from '@/components/ThemedView'; // Adjust import path
import { ThemedText } from '@/components/ThemedText'; // Adjust import path

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);
  const ip = getIpAddress();
  const { userId } = useUser();

  const handleSearch = async (text) => {
    setSearch(text);
  
    try {
      const response = await fetch(`${ip}/users?search=${encodeURIComponent(text)}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
  
      // Try to parse the response body as JSON
      const data = await response.json();
  
      // Filter out already existing friends
      const filtered = data.filter(
        user => !friends.some(friend => friend._id === user._id)
      );
  
      setResults(filtered);
    } catch (err) {
      console.error('Search error:', err.message);
    }
  };
  

  const addFriend = async (user) => {
    console.log(`Attempting to add friend: ${user.username} (ID: ${user._id})`);
  
    try {
      const response = await fetch(`${ip}/users/${userId}/friends/${user._id}`, {
        method: 'POST',
      });
  
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();  // Capture the error text if any
        throw new Error(`Failed to add friend: ${response.statusText}. Server response: ${errorText}`);
      }
  
      // Try to parse the response body as JSON
      const updatedUser = await response.json();
      console.log('Updated user after adding friend:', updatedUser);
  
      setFriends(prevFriends => [...prevFriends, user]);
  
      // Clear the search and results
      setSearch('');
      setResults([]);
    } catch (err) {
      console.error('Add friend error:', err.message);
    }
  };
  
  

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${ip}/users/${userId}`);
        const userData = await res.json();
        setFriends(userData.friends);
      } catch (err) {
        console.error('Failed to load friends:', err);
        console.log(friends);
      }
    };

    fetchFriends();
  }, [userId]); // Added userId as a dependency to refetch friends when userId changes

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Friends</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Search for a friend..."
          value={search}
          onChangeText={handleSearch}
          style={styles.input}
        />

        {results.map(user => (
          <TouchableOpacity key={user._id} onPress={() => addFriend(user)} style={styles.resultItem}>
            <Text>Add {user.username}</Text>
          </TouchableOpacity>
        ))}

        <ThemedText type="subtitle">Your Friends:</ThemedText>
        {friends.map(friend => (
          <Text key={friend._id} style={styles.friendItem}>{friend.username}</Text>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepContainer: { gap: 8, marginBottom: 8, padding: 20 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  resultItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 5,
  },
  friendItem: {
    padding: 6,
    color: '#444',
  },
});
