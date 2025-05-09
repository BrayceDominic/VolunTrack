import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import axios from 'axios';

const App = () => {
  const [qrCodeData, setQrCodeData] = useState('');

  const sendAttendance = async () => {
    if (!qrCodeData.trim()) {
      Alert.alert('Error', 'Please enter or scan QR code data.');
      return;
    }

    let parsedData;

    try {
      parsedData = JSON.parse(qrCodeData); // Parse QR data into JSON object
    } catch (err) {
      Alert.alert('Invalid QR Code', 'Make sure the QR code contains valid JSON data.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.101.180:5000/api/attendance/mark', parsedData);

      if (response.data && response.data.message === "Attendance marked successfully") {
        Alert.alert('Success', 'Attendance recorded.');
        setQrCodeData(''); // Clear input after success
      } else {
        Alert.alert('Failed', 'Attendance failed.');
      }
    } catch (error) {
      console.error("Attendance Error:", error.response?.data || error.message);
      Alert.alert('Error', 'Could not send attendance.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
      </View>

      {/* QR Code Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Paste scanned QR code data here"
        value={qrCodeData}
        onChangeText={setQrCodeData}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={sendAttendance}>
        <Text style={styles.buttonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'tan' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', marginTop: 38 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#004158' },
  button: { backgroundColor: '#004158', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16 },
  input: {
    height: 120,
    borderColor: '#004158',
    borderWidth: 3,
    borderRadius: 18,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#000',
    backgroundColor: '#fff'
  },
});

export default App;
