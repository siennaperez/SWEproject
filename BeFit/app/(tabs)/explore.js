import { StyleSheet, Image, Platform,View, ScrollView, SafeAreaView} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ScrollView>
    {/*HEADER!!*/}
    <ThemedView style={styles.profileHeader} 
    lightColor='#000000'
    darkColor='#000000' >
    <ThemedView style={styles.profileContainer}>
          <IconSymbol 
            name="person.circle.fill" 
            size={150} 
            color="#808080" 
          />
        </ThemedView>
    <ThemedText type="title" style = {{marginTop: -40}}>UserName</ThemedText>
    <ThemedText type="default" style = {{marginTop:8, textAlign: 'center' }}>Here goes bio! Blah Blah blah can only be certain lenght question mark?</ThemedText>
    <SafeAreaView style={styles.followingHeaderContainer}>
      <ThemedText type="defaultSemiBold" style = {{marginTop: 10}}>Followers</ThemedText>
      <ThemedText type="defaultSemiBold" style = {{marginTop: 10}}>Followers</ThemedText>
      </SafeAreaView>
      <SafeAreaView style={styles.followerNumbersContainer}>
      <ThemedText type="defaultSemiBold" style = {{marginTop: 2}}>10</ThemedText>
      <ThemedText type="defaultSemiBold" style = {{marginTop: 2}}>10</ThemedText>
      </SafeAreaView>
  </ThemedView>

  {/*IDEALLY GRID?!!*/}





  </ScrollView>
  

    
  );
}

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
