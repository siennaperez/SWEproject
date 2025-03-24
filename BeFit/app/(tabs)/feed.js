import React, { useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

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

export default function FeedScreen() {
  const [posts] = useState(samplePosts);
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Workout Feed</ThemedText>
      </ThemedView>

      {posts.map((item) => (
        <ThemedView key={item.id} style={styles.postContainer}>
          <Text style={styles.username}>{item.username}</Text>
          <Image source={{ uri: item.image }} style={styles.postImage} />
          <Text style={styles.caption}>{item.caption}</Text>
        </ThemedView>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/new-post')}
      >
        <Text style={styles.buttonText}>+ Create Post</Text>
      </TouchableOpacity>

    
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
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
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
