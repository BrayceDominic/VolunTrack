import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const app = () => {
  const [volunteerId, setVolunteerId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);

  const API = 'http://192.168.100.47:5000';

  useEffect(() => {
    getVolunteerId();
  }, []);

  const getVolunteerId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setVolunteerId(id);
    if (id) {
      fetchTasks(id);
      fetchReplies(id);
    }
  };

  const fetchTasks = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/volunteers/${id}`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Error', 'Could not fetch tasks');
    }
  };

  const fetchReplies = async (id) => {
    try {
      const res = await axios.get(`${API}/api/replies/${id}`);
      setReplies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTask || !feedback.trim()) {
      Alert.alert('Validation', 'Please select a task and write feedback.');
      return;
    }

    const payload = {
      volunteer_id: volunteerId,
      supervisor_id: selectedTask.supervisor_id,
      task_id: selectedTask.task_id,
      feedback: feedback,
      date_submitted: new Date().toISOString(),
    };

    try {
      await axios.post(`${API}/api/feedback`, payload);
      Alert.alert('Success', 'Feedback submitted!');
      setFeedback('');
      setSelectedTask(null);
      fetchReplies(volunteerId);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit feedback.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
        <Text style={styles.headerTitle}>Submit Feedback</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Task</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#004158" />
      ) : (
        tasks.map((task) => (
          <TouchableOpacity
            key={task.task_id}
            onPress={() => setSelectedTask(task)}
            style={[
              styles.taskButton,
              selectedTask?.task_id === task.task_id && styles.selectedTask,
            ]}
          >
            <Text style={styles.buttonText}>{task.task_title}</Text>
            <Text style={styles.subText}>Task ID: {task.task_id}</Text>
            <Text style={styles.subText}>Supervisor ID: {task.supervisor_id}</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>Your Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback..."
        multiline
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Send Feedback</Text>
      </TouchableOpacity>

      {replies.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Supervisor Replies</Text>
          {replies.map((reply, index) => (
            <View key={index} style={styles.replyCard}>
              <Text style={styles.replyTask}>{reply.task_name}</Text>
              <Text style={styles.replyText}>{reply.reply}</Text>
              <Text style={styles.replyDate}>
                {new Date(reply.reply_date).toLocaleString()}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'tan', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#004158' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#004158', marginVertical: 12 },
  input: {
    borderWidth: 2,
    borderColor: '#004158',
    borderRadius: 10,
    padding: 12,
    height: 120,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#004158',
    borderRadius: 10,
    padding: 15,
    marginTop: 12,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontSize: 16 },
  taskButton: {
    backgroundColor: '#d9d9d9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTask: {
    backgroundColor: '#004158',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  subText: {
    color: '#333',
    fontSize: 12,
  },
  replyCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#004158',
  },
  replyTask: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#004158',
  },
  replyText: {
    marginTop: 4,
    fontSize: 14,
    color: '#000',
  },
  replyDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default app;
