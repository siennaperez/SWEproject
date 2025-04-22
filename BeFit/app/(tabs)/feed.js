import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '../(login)/userContext'; 
import { getIpAddress } from '../(login)/ipConfig'; 



export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const router = useRouter();
  const { userId } = useUser(); 
  const ip = getIpAddress();


  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`${ip}/posts/friends/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      console.log('Fetched posts:', data); // Log what you're receiving
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);
  
  useEffect(() => {
    // Log the post data to debug
    if (posts.length > 0) {
      console.log("First post imageUrl:", posts[0].imageUrl);
      console.log("All posts:", posts.map(p => ({id: p._id, imageUrl: p.imageUrl})));
    }
  }, [posts]);
  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (userId) {
      fetchAllPosts();
    }
  }, [userId]);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 100, textAlign: 'center', fontSize: 16 }}>
          Loading your feed...
        </Text>
      </View>
    );
  }
  

  return (
  
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Workout Feed</ThemedText>
        </ThemedView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((item) => (
          <ThemedView key={item._id} style={styles.postContainer}>
            <Text style={styles.username}>{item.userId?.username || 'Unknown User'}</Text>
            <View style={styles.imageContainer}>
            <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.postImage}
              />
              </View>
            {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
            <Text style={styles.timestamp}>
              {item.createdAtFormatted || new Date(item.createdAt).toLocaleString()}
            </Text>
          </ThemedView>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/new-post')}
        >
          <Text style={styles.buttonText}>+ Create Post</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer content</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#000',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    zIndex: 1,
  },
  titleContainer: {
    backgroundColor: '#000',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingBottom: 150, 
    paddingHorizontal: 10,
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    marginHorizontal: 20,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});
