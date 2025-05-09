import React, { useState } from 'react'; 
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: '1', task_name: 'Assist in community event', status: 'pending', due_date: '2025-03-01' },
    { id: '2', task_name: 'Help with medical outreach', status: 'pending', due_date: '2025-03-02' },
    { id: '3', task_name: 'Distribute educational materials', status: 'pending', due_date: '2025-03-03' },
  ]);

  const [feedback, setFeedback] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  // Function to update task status (for now, updates UI only)
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    Alert.alert('Success', `Task marked as ${newStatus}`);
  };

  // Function to submit feedback (API call commented)
  const submitFeedback = () => {
    if (!selectedTask || !feedback.trim()) {
      Alert.alert('Error', 'Please select a task and enter feedback.');
      return;
    }

    // Future API Integration (commented)
    /*
    fetch(`https://your-api-url.com/tasks/${selectedTask}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    })
    .then(() => {
      setFeedback('');
      Alert.alert('Success', 'Feedback sent to supervisor!');
    })
    .catch(error => console.error('Error submitting feedback:', error));
    */

    setFeedback('');
    Alert.alert('Success', 'Feedback (Mock) sent to supervisor!');
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.task_name}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <Text style={styles.taskDueDate}>Due: {item.due_date}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.statusButton} onPress={() => updateTaskStatus(item.id, 'in_progress')}>
          <Text style={styles.buttonText}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusButton} onPress={() => updateTaskStatus(item.id, 'completed')}>
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={() => setSelectedTask(item.id)}>
        <Text style={styles.selectButtonText}>
          {selectedTask === item.id ? 'Selected' : 'Select Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
        <Text style={styles.headerTitle}>Task Management</Text>
      </View>

      {/* Task List */}
      <FlatList data={tasks} renderItem={renderTaskItem} keyExtractor={(item) => item.id.toString()} />

      {/* Feedback Section */}
      <Text style={styles.sectionTitle}>Submit Feedback</Text>
      {selectedTask && (
        <Text style={styles.selectedTask}>
          Task Selected: {tasks.find((task) => task.id === selectedTask)?.task_name}
        </Text>
      )}
      <TextInput style={styles.input} placeholder="Enter feedback" value={feedback} onChangeText={setFeedback} />
      <TouchableOpacity style={styles.button} onPress={submitFeedback}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'tan' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', marginTop: 38 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#004158' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#004158', marginTop: 16 },
  taskItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#004158' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#004158' },
  taskStatus: { fontSize: 14, color: '#004158' },
  taskDueDate: { fontSize: 14, color: '#004158' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statusButton: { backgroundColor: '#004158', padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonText: { color: 'tan' },
  selectButton: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  selectButtonText: { color: '#004158' },
  input: { height: 40, borderColor: '#004158', borderWidth: 1, borderRadius: 4, marginBottom: 16, paddingHorizontal: 8 },
  button: { backgroundColor: '#004158', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  selectedTask: { fontSize: 16, fontWeight: 'bold', marginTop: 8, color: '#004158' },
});

export default App;
