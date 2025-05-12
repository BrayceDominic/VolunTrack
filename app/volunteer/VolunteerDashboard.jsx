import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const screenWidth = Dimensions.get("window").width;

const App = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

  const fetchData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const id = await AsyncStorage.getItem('userId');

      if (name) setUserName(name);
      if (id) setUserId(id);

      if (!id) {
        alert("Volunteer ID not found in storage.");
        return;
      }

      const res = await axios.get(`http://192.168.101.180:5000/api/volunteers/${id}`);
      setProjects(res.data);
    } catch (err) {
      console.error("❌ Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const drawerLinks = [
    {
      icon: "assignment",
      title: "Report",
      onPress: async () => {
        const id = await AsyncStorage.getItem("userId");
        router.push({ pathname: "/volunteer/report", params: { id, role: "volunteer" } });
      },
    },
    {
      icon: "school",
      title: "Training",
      onPress: async () => {
        const id = await AsyncStorage.getItem("userId");
        router.push({ pathname: "/volunteer/training", params: { id, role: "volunteer" } });
      },
    },
    {
      icon: "feedback",
      title: "Feedback",
      onPress: async () => {
        const id = await AsyncStorage.getItem("userId");
        router.push({ pathname: "/volunteer/feedbacks", params: { id, role: "volunteer" } });
      },
    },
    {
      icon: "assignment-turned-in",
      title: "Attendance",
      onPress: async () => {
        const id = await AsyncStorage.getItem("userId");
        router.push({ pathname: "/volunteer/attendance", params: { id, role: "volunteer" } });
      },
    },
    {
      icon: "bar-chart",
      title: "Statistics",
      onPress: async () => {
        const id = await AsyncStorage.getItem("userId");
        router.push({ pathname: "/volunteer/statistics", params: { id, role: "volunteer" } });
      },
    },
    {
      icon: "logout",
      title: "Logout",
      onPress: async () => {
        const time = new Date().toLocaleString();
        const logoutMessage = `👋 You logged out at ${time}`;
        const existing = await AsyncStorage.getItem("notifications");
        const notifications = existing ? JSON.parse(existing) : [];
        notifications.unshift({ id: Date.now(), message: logoutMessage, time });
        await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
        await AsyncStorage.clear();
        router.replace("Login");
      }
    },
  ];

  // Split Quick Access items into rows of 2
  const chunkedLinks = [];
  for (let i = 0; i < drawerLinks.length; i += 2) {
    chunkedLinks.push(drawerLinks.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.welcomeText}>
              {userName ? `Welcome, ${userName}!` : 'Welcome!'}
            </Text>
            <Text style={styles.sectionTitle}>ENROLLED PROJECTS</Text>
            {loading && <ActivityIndicator size="large" color="#004158" />}
          </>
        }
        data={loading ? [] : projects}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/volunteer/projects",
              params: { projectId: item.id },
            }}
            asChild
          >
            <TouchableOpacity style={styles.projectCard}>
              <Text style={styles.projectName}>📊 {item.project_name}</Text>
              {/* <Text style={styles.task_title}>TASK ID: {item.task_id}</Text> */}
              <Text style={styles.task_title}>{item.task_title}</Text>
              <Text style={styles.task_description}>📋 {item.task_description}</Text>
              <Text style={styles.due_date}>📅 DUE: {formatDate(item.due_date)}</Text>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id?.toString()}
        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            {chunkedLinks.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.quickAccessRow}>
                {row.map((link) => (
                  <TouchableOpacity
                    key={link.title}
                    style={styles.quickAccessCard}
                    onPress={link.onPress}
                  >
                    <Icon name={link.icon} size={30} color="#004158" />
                    <Text style={styles.quickAccessText}>{link.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        }
        contentContainerStyle={styles.feedContainer}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push({ pathname: "/volunteer/VolunteerDashboard", params: { volunteerId: userId } })}>
          <Ionicons name="home-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: "/volunteer/notifications", params: { volunteerId: userId } })}>
          <Ionicons name="notifications-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: "/volunteer/profiles", params: { volunteerId: userId } })}>
          <Ionicons name="person-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: "/volunteer/help", params: { volunteerId: userId } })}>
          <Ionicons name="settings-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 25, backgroundColor: "tan" },
  feedContainer: { padding: 16, paddingBottom: 100 },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004158",
    marginBottom: 10,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#004158",
    textAlign: "center",
  },
  projectCard: {
    backgroundColor: "white",
    padding: 7,
    borderRadius: 15,
    marginBottom: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#004158",
    marginBottom: 4,
  },
  task_title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#004158",
    marginBottom: 4,
  },
  task_description: {
    fontSize: 14,
    fontWeight: "500",
    color: "#004158",
    marginBottom: 4,
  },
  due_date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004158",
    marginBottom: 4,
  },
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  quickAccessCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAccessText: {
    color: "#004158",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004158",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

export default App;
