import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [results, setResults] = useState([]);

  const handleSearch = async (text) => {
    setSearch(text);
  
    try {
      const response = await fetch(`http://10.138.10.93:3000/users?search=${encodeURIComponent(text)}`);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server returned error HTML:', errorText);
        throw new Error('Failed to fetch users');
      }
  
      const data = await response.json();
  
      const filtered = data.filter(
        user => !friends.some(friend => friend._id === user._id)
      );
  
      setResults(filtered);
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  

  const addFriend = (user) => {
    setFriends([...friends, user]);
    setSearch('');
    setResults([]);
  };

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
