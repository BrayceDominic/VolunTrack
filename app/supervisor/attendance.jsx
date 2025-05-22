import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const AttendanceScreen = () => {
  const [text, setText] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [volunteerId, setVolunteerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const qrRef = useRef();
  const { id: supervisor_id } = useLocalSearchParams();
  
  useEffect(() => {
    if (supervisor_id) {
      setSupervisorId(supervisor_id);
      setSessionDate(new Date().toISOString()); // Automatically set the current date and time
    }
  }, [supervisor_id]);

  const generateQRCode = () => {
    if (!volunteerId || !projectId || !taskId) {
      Alert.alert('Missing Information', 'Please select Volunteer, Project, and Task.');
      return;
    }
    setShowQR(true);
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`http://192.168.100.47:5050/api/attendance/${supervisorId}`);
      setAttendanceRecords(res.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    if (supervisorId) {
      fetchAttendance();
    }
  }, [supervisorId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const copyToClipboard = async () => {
    const qrData = JSON.stringify({
      volunteer_id: volunteerId,
      project_id: projectId,
      task_id: taskId,
      supervisor_id: supervisorId,
      session_date: sessionDate,
    });

    await Clipboard.setStringAsync(qrData);
    Alert.alert('Copied', 'QR data copied to clipboard!');
  };

  const saveQRCodeImage = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Supported', 'Saving QR images is not supported on web.');
        return;
      }

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
      Alert.alert('Saved', 'QR Code image saved to your gallery!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save QR image');
    }
  };

  const shareQRCodeImage = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Supported', 'Sharing is not supported on web.');
        return;
      }

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to share QR image');
    }
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.itemText}> <Text style={styles.itemText2}>Volunteer: </Text>{item.volunteer_name}</Text>
      <Text style={styles.itemText}><Text style={styles.itemText2}> Project: </Text>{item.project_name}</Text>
      <Text style={styles.itemText}><Text style={styles.itemText2}> Task: </Text>{item.task_title}</Text>
      <Text style={styles.itemText}><Text style={styles.itemText2}> Scanned at: </Text>{formatTimestamp(item.timestamp)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>QR Code Generator</Text>

      {/* Volunteer ID */}
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer ID"
        value={volunteerId}
        onChangeText={setVolunteerId}
      />

      {/* Project ID */}
      <TextInput
        style={styles.input}
        placeholder="Enter Project ID"
        value={projectId}
        onChangeText={setProjectId}
      />

      {/* Task ID */}
      <TextInput
        style={styles.input}
        placeholder="Enter Task ID"
        value={taskId}
        onChangeText={setTaskId}
      />

      {/* Supervisor ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Supervisor ID"
        value={supervisorId}
        onChangeText={setSupervisorId}
      />

      {/* Session Date (Automatically filled) */}
      <TextInput
        style={styles.input}
        placeholder="Session Date"
        value={sessionDate}
        editable={false}
      />


      <Button title="Generate QR Code" onPress={generateQRCode} />

      {showQR && (
        <View style={styles.qrContainer} collapsable={false} ref={qrRef}>
          <Text style={styles.qrLabel}>Scan this QR:</Text>
          {Platform.OS === 'web' ? (
            <Image
              source={{
                uri: `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
                  JSON.stringify({
                    volunteer_id: volunteerId,
                    project_id: projectId,
                    task_id: taskId,
                    supervisor_id: supervisorId,
                    session_date: sessionDate,
                  })
                )}`,
              }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <QRCode
              value={JSON.stringify({
                volunteer_id: volunteerId,
                project_id: projectId,
                task_id: taskId,
                supervisor_id: supervisorId,
                session_date: sessionDate,
              })}
              size={200}
            />
          )}
          <View style={styles.buttonRow}>
            <Button title="Copy Data" onPress={copyToClipboard} />
            <Button title="Save QR" onPress={saveQRCodeImage} />
            <Button title="Share QR" onPress={shareQRCodeImage} />
          </View>
        </View>
      )}

      <Text style={styles.heading}>Attendance Records</Text>
      <FlatList
        data={attendanceRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'tan',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 3,
    marginTop: 10,
    color: '#004158',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  qrLabel: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  attendanceItem: {
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#004158',
    fontWeight: '500',
  },
  itemText2: {
    fontSize: 16,
    color: '#004158',
    fontWeight: 'bold',
  },
});
