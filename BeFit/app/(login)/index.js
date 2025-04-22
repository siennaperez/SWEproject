import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add any refresh logic here if needed
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Redirect href="/(login)/login" />
    </ScrollView>
  );
}
