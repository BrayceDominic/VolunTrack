import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const app = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`http://192.168.100.243:5000/update-password/:email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'Password updated successfully.');
        setEmail('');
        setNewPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Enter new password"
        style={styles.input}
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 },
  button: { backgroundColor: '#17a2b8', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
