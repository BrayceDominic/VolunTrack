import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const app = () => {
  const { volunteerId } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteerTasks = async () => {
    try {
      const res = await axios.get(`http://192.168.100.47:5000/api/volunteers/${volunteerId}`);
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
    return <ActivityIndicator size="large" color="#004158" style={{ marginTop: 50 }} />;
  }

  if (tasks.length === 0) {
    return <Text style={styles.error}>No tasks found for this volunteer.</Text>;
  }

  // Extract common info (same for all tasks)
  const { volunteer_name, volunteer_email } = tasks[0];

  return (
    <ScrollView style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "tan", padding: 16},
  header: { fontSize: 22, fontWeight: "bold", color: "#004158", marginBottom: 25, textAlign: "center" },
  detailBox: {
    backgroundColor: "#004158",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: { fontWeight: "bold", fontSize: 20, marginTop: 20, color: "#ffffff" },
  value: { fontSize: 16, marginTop: 4, color: "#ffffff" },
  error: { marginTop: 50, textAlign: "center", fontSize: 16, color: "red" },
  taskBox: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  taskDetail: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default app;
