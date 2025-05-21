import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Alert, ScrollView
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const app = () => {
  const { id: supervisor_id } = useLocalSearchParams();
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (supervisor_id) {
      fetchVolunteers();
      fetchTasks();
      fetchProjects();
    }
  }, [supervisor_id]);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get(`http://192.168.100.47:5000/api/supervisors/${supervisor_id}/volunteers`);
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://192.168.100.47:5000/api/tasks/${supervisor_id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error fetching tasks');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://192.168.100.47:5000/api/projects/${supervisor_id}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error fetching projects');
    }
  };

  const addTask = async () => {
    if (!newTask || !dueDate || !projectId || !description || !supervisor_id) {
      Alert.alert('Please fill in all fields');
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.100.47:5000/api/tasks/create', {
        title: newTask,
        description: description,
        due_date: dueDate,
        project_id: projectId,
        supervisor_id: supervisor_id,
        volunteer_id: selectedVolunteerId, // send if selected
      });
  
      setTasks([...tasks, response.data]);
  
      // Reset form
      setNewTask('');
      setDescription('');
      setDueDate('');
      setProjectId('');
      setSelectedVolunteerId(null);
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error creating task');
    }
  };
  

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskDueDate}>
        Due: {new Date(item.due_date).toLocaleDateString()}
      </Text>
      <Text style={styles.taskProjectId}>
        Project ID: {item.project_id}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
        <Text style={styles.headerTitle}>Task Management</Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />

      <View style={styles.addTaskContainer}>
        {/* Select Project First */}
        <Text style={styles.pickerLabel}>Select Project:</Text>
        <View style={styles.picker}>
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.volunteerOption,
                projectId === String(project.id) && styles.selectedVolunteer,
              ]}
              onPress={() => setProjectId(String(project.id))}
            >
              <Text style={styles.volunteerName}>{project.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task Title */}
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask}
          onChangeText={setNewTask}
        />

        {/* Due Date */}
        <TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
        />

        {/* Select Volunteer */}
        <Text style={styles.pickerLabel}>Assign to:</Text>
        <View style={styles.picker}>
          {volunteers.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.volunteerOption,
                selectedVolunteerId === v.id && styles.selectedVolunteer,
              ]}
              onPress={() => setSelectedVolunteerId(v.id)}
            >
              <Text style={styles.volunteerName}>{v.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description LAST */}
        <TextInput
          style={styles.input}
          placeholder="Task Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: 'tan',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#004158' },
  taskItem: { padding: 10, borderBottomWidth: 2, borderBottomColor: '#004158', backgroundColor: 'white',marginBottom: 10,borderRadius: 10, },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#004158' },
  taskDescription: { fontSize: 14, color: '#004158', marginTop: 4, marginBottom: 4 },
  taskDueDate: { fontSize: 14, color: '#004158' },
  taskProjectId: { fontSize: 14, color: '#004158', fontStyle: 'italic' },
  addTaskContainer: { marginTop: 20 },
  input: {
    height: 40,
    borderColor: '#004158',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004158',
    marginBottom: 8,
  },
  picker: { flexDirection: 'row', flexWrap: 'wrap', 
  },
  volunteerOption: {
    padding: 8,
    margin: 8,
    borderWidth: 1,
    borderColor: '#004158',
    borderRadius: 4,
  },
  selectedVolunteer: { backgroundColor: 'white' },
  volunteerName: { color: '#004158' },
  button: {
    backgroundColor: '#004158',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%', // Make button stretch across the screen
    marginBottom: 20, // Adds space below the button

  },
  buttonText: { color: 'white', fontSize: 16 },
});

export default app;
