import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const app = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const verifyResetCode = async () => {
    try {
      const response = await fetch('https://192.168.100.243:5000/api/auth/reset-password/:token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reset_code: setCode }),
      });
      const data = await response.json();
      if (data.success) {
        // Navigate to Reset Password screen
        navigation.navigate('ResetPassword', { email, resetToken: data.token });
      } else {
        Alert.alert('Error', data.message || 'Invalid reset code');
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Reset Code</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Enter reset code"
        style={styles.input}
        onChangeText={setCode}
        value={code}
      />
      <TouchableOpacity style={styles.button} onPress={verifyResetCode}>
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
