import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

// Sample posts data
const samplePosts = [
  {
    id: '1',
    username: 'fit_john',
    image: 'https://source.unsplash.com/200x200/?fitness,gym',
    caption: 'Great workout today! 💪 #StayFit',
  },
  {
    id: '2',
    username: 'health_anna',
    image: 'https://source.unsplash.com/200x200/?running,exercise',
    caption: 'Morning run was amazing! 🏃‍♀️ #CardioTime',
  },
];

const FeedScreen = () => {
  const router = useRouter();
  const [posts, setPosts] = useState(samplePosts);

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Workout Feed</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/new-post')} // Navigate to post creation screen
      >
        <Text style={styles.buttonText}>+ Create Post</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  caption: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
