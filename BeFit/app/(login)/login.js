import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { useUser } from './userContext'; 
import { getIpAddress } from './ipConfig'; 

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserId } = useUser(); 
  const ip = getIpAddress();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Both username and password are required.');
      return;
    }

    setLoading(true);
  
    try {
      const response = await fetch(`${ip}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        const receivedUserId = data.userId || data._id || data.id;

        if (receivedUserId) {
          setUserId(receivedUserId); // Store the userId in global state
          console.log('Login successful, User ID:', receivedUserId);
        }
        Alert.alert('Success', 'Login successful!', [
         {text: 'OK',
          onPress: () => router.push('/profile')}
        // router.push('/profile')
        ]);
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gotoCreate = () => {
    router.push('./create-account');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.logoContainer}>
          <ThemedText type="BeFit" style = {{marginTop: 100}}>BEFIT</ThemedText>
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
              onPress={() => handleLogin()}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? 'Loading...' : 'Log in'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.createAccountButton, loading && styles.buttonDisabled]} 
            onPress={gotoCreate}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? 'Loading...' : 'Create new account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

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
    marginTop: '100',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: '#CDE2D0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#666',
    fontSize: 20,
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
    borderWidth: 0.75
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '100',
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
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '200',

  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "750",
  },
  buttonText: {
    color: '#c1c1c1',
    fontSize: 16,
    fontWeight: "800",
  },
  logopic: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 80,
  },
  
});

export default LoginScreen;