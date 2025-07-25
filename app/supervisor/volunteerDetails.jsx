import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform, StatusBar } from "react-native";
import axios from "axios";
import { useLocalSearchParams, Link } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const { volunteerId } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteerTasks = async () => {
    try {
      const res = await axios.get(`http://192.168.100.239:5050/api/volunteers/${volunteerId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch volunteer tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerTasks();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor="#004158"
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        />
        <ActivityIndicator size="large" color="#004158" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor="#004158"
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        />
        <Text style={styles.error}>No tasks found for this volunteer.</Text>
      </SafeAreaView>
    );
  }

  const { volunteer_name, volunteer_email } = tasks[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#004158"
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>

        <Text style={styles.header}>Volunteer Details</Text>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{volunteer_name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{volunteer_email}</Text>

          <Text style={[styles.label, { marginTop: 30 }]}>Assigned Tasks:</Text>
          {tasks.map((task, index) => (
            <View key={index} style={styles.taskBox}>
              <Text style={styles.taskTitle}>• {task.task_title}</Text>
              <Text style={styles.taskDetail}>Project: {task.project_name}</Text>
              <Text style={styles.taskDetail}>Due: {new Date(task.due_date).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'tan',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // ensures nothing is cut off at bottom
    backgroundColor: 'tan',
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004158",
    marginBottom: 25,
    textAlign: "center"
  },
  detailBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    color: "#004158"
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: "#004158"
  },
  error: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
    color: "red"
  },
  taskBox: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004158",
  },
  taskDetail: {
    fontSize: 14,
    color: "#004158",
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});

export default App;
