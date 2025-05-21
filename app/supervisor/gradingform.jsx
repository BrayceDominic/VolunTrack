import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Alert, Pressable, Modal, FlatList
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const App = () => {
  const { id: supervisorId } = useLocalSearchParams();
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [selectedVolunteerName, setSelectedVolunteerName] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [score, setScore] = useState('');
  const [comments, setComments] = useState('');

  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  useEffect(() => {
    fetch(`http://192.168.100.47:5000/api/supervisors/${supervisorId}/volunteers`)
      .then(res => res.json())
      .then(setVolunteers)
      .catch(console.error);

    fetch(`http://192.168.100.47:5000/api/tasks/${supervisorId}`)
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, [supervisorId]);

  const handleSubmit = () => {
    if (!score || isNaN(score)) return Alert.alert("Enter a valid score");

    fetch('http://192.168.100.47:5000/api/grades/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supervisor_id: supervisorId,
        volunteer_id: selectedVolunteer,
        task_id: selectedTask,
        score: parseInt(score),
        comments,
      }),
    })
      .then(res => res.json())
      .then(data => Alert.alert("Grade Submitted", data.message))
      .catch(err => Alert.alert("Error", err.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Volunteer Dropdown */}
      <Text style={styles.label}>Volunteer:</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => setVolunteerModalVisible(true)}
      >
        <Text>{selectedVolunteerName || 'Select a Volunteer'}</Text>
      </Pressable>

      <Modal visible={volunteerModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={volunteers}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedVolunteer(item.id);
                    setSelectedVolunteerName(item.name);
                    setVolunteerModalVisible(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Task Dropdown */}
      <Text style={styles.label}>Task:</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => setTaskModalVisible(true)}
      >
        <Text>{selectedTaskName || 'Select a Task'}</Text>
      </Pressable>

      <Modal visible={taskModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={tasks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedTask(item.id);
                    setSelectedTaskName(item.title);
                    setTaskModalVisible(false);
                  }}
                >
                  <Text>{item.title}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Score Input */}
      <Text style={styles.label}>Score (0-100):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={score}
        onChangeText={setScore}
      />

      {/* Comments Input */}
      <Text style={styles.label}>Comments:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={comments}
        onChangeText={setComments}
      />

      <Button title="Submit Grade" onPress={handleSubmit} color="#004158" marginTop="40" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'tan', flex: 1, },
  label: { marginTop: 10, fontSize: 16, color: '#004158' },
  input: {
    borderWidth: 1, borderColor: '#004158', padding: 10, marginBottom: 10, borderRadius: 5
  },
  dropdown: {
    borderWidth: 1, borderColor: '#004158', padding: 10, borderRadius: 5, marginBottom: 10,
    backgroundColor: '#f0f0f0'
  },
  modalContainer: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'tan', margin: 20, borderRadius: 10, padding: 20, maxHeight: '60%', color: 'white',
  },
  modalItem: {
    padding: 15, borderBottomWidth: 1, borderColor: '#ccc',
  },
});

export default App;
