import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'; // Import Notifications

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle Login
  const handleLogin = async () => {
    const userData = {
      email,
      password,
    };


    try {
      const response = await fetch('http://192.168.100.47:5050/api/auth/login', {
      // const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data);

        // const welcomeMessage = `Welcome, ${data.user.name}! You have successfully logged in.`;


        // Access the 'user' object to get id, role, etc.
        const { id, role } = data.user; // Get id and role from the 'user' object
        const token = data.token;

        if (role && id) {
          await AsyncStorage.setItem('userRole', role);
          await AsyncStorage.setItem('userId', id.toString()); // ✅ Store userId properly
          if (token) {
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userName', data.user.name);
          }
        const time = new Date().toLocaleString();
       const loginMessage = `✅Welcome, ${data.user.name}!, You Successfully logged in`;
      const existing = await AsyncStorage.getItem('notifications');
      const notifications = existing ? JSON.parse(existing) : [];
      notifications.unshift({ id: Date.now(), message: loginMessage, time: new Date().toLocaleString() });
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));

          console.log('Navigating to:', role);
          
          // // Trigger a notification after successful login
          // await Notifications.scheduleNotificationAsync({
          //   content: {
          //     title: 'Welcome Back!',
          //     body: `Hello, ${data.user.name}. You have successfully logged in.`,
          //   },
          //   trigger: null, // This will trigger the notification immediately
          // });

          // Navigate based on user role
          if (role === 'volunteer') {
            router.push('/volunteer/VolunteerDashboard');
          } else if (role === 'supervisor') {
            router.push('/supervisor/SupervisorDashboard');
          } else {
            alert(`Unknown role: ${role}`);
          }
        } else {
          alert('Login successful but user role or ID not found.');
        }
      } else {
        const errorText = await response.text();
        alert(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <View style={styles.container}>
      <Link href="/" style={styles.home}>
        <Icon name="home" size={40} color="#004158" />
      </Link>

      <Image source={require("@/assets/images/vt.jpg")} style={styles.image} />


      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoComplete="off"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          autoComplete="off"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Link href="/Signup" style={styles.sglink}>
        <Text style={styles.sg}>
          Don't have an Account? <Text style={styles.sg2}>SIGN UP</Text>
        </Text>
      </Link>

      <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
          <Text style={{ color: '#004158', fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'tan',
    // marginTop: 25,
  },
  sg: {
    fontSize: 15,
    color: '#004158',
  },
  sglink: {
    marginTop: 15,
  },
  sg2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004158',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  home: {
    marginTop: -120,
    marginBottom: 120,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: '#004158',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 100, // Adjust width
    height: 100, // Adjust height
    // resizeMode: "contain",
    marginTop: 25,
    marginLeft: 130,
    marginBottom: 5,
    borderRadius: 70,
    },
});

export default App;
