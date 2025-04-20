import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StyleSheet, SafeAreaView } from 'react-native';

import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


const CreateAccountScreen = () => {
  const router = useRouter();
  //const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Both username and password are required.');
      return;
    }

    console.log('Username:', email);
    console.log('Password:', password);
  
    console.log('Sending request to:', 'http://10.138.217.191:3000/signup');
    try {
      const response = await fetch('http://10.138.217.191:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }), // Ensure 'username' is correct
      });
      console.log('test1');
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Account created!');
      } else {
        Alert.alert('Signup Failed', data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.logoContainer}>
          <ThemedText type="BeFit" style={{ marginTop: 100 }}>Create a BeFit Account</ThemedText>
        </SafeAreaView>        
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? 'Creating...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.createAccountButton, loading && styles.buttonDisabled]} 
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? 'Loading...' : 'Back to Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

// 🔹 **Reuses the styles from LoginScreen for consistency**
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    borderWidth: 0.75,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '100%',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createAccountButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: 200,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "750",
  },
});


export default CreateAccountScreen;