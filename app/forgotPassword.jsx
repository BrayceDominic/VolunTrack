import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const app = () => {
  const [email, setEmail] = useState('');



    const sendResetCode = async () => {
      try {
        const response = await fetch('https://192.168.100.243:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          // Navigate to the next screen
          navigation.navigate('ResetCode', { email });
        } else {
          Alert.alert('Error', data.message || 'Failed to send reset code');
        }
      } catch (error) {
        Alert.alert('Error', 'Network or server error');
      }
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TouchableOpacity style={styles.button} onPress={sendResetCode}>
        <Text style={styles.buttonText}>Send Reset Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'tan' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#004158' },
  input: { borderWidth: 1, borderColor: '#004158', padding: 10, marginBottom: 20, borderRadius: 8 },
  button: { backgroundColor: '#004158', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
