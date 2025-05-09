import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Linking,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const App = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      const id = await AsyncStorage.getItem("userId");

      if (name) setUserName(name);
      if (id) setUserId(id);

      if (!id) {
        alert("Supervisor ID not found in storage.");
        return;
      }

      const res = await axios.get(
        `http://192.168.101.180:5000/api/supervisors/${id}/volunteers`
      );
      setVolunteers(res.data);
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
    { icon: "home", title: "Home", route: "/supervisor/SupervisorDashboard" },
    {
      icon: "assignment",
      title: "Projects",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/projects",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "people",
      title: "Attendance",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/attendance",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "task",
      title: "Tasks",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/tasks",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "feedback",
      title: "Feedback",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/feedbacks",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "star",
      title: "Rating",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/gradingform",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "bar-chart",
      title: "Statistics",
      onPress: async () => {
        const userId = await AsyncStorage.getItem("userId");
        router.push({
          pathname: "/supervisor/gradeschart",
          params: { id: userId, role: "supervisor" },
        });
      },
    },
    {
      icon: "logout",
      title: "Logout",
      onPress: async () => {
        await AsyncStorage.clear();
        router.replace("Login");
      },
    },
  ];

  const renderQuickAccessItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quickAccessButton}
      onPress={item.onPress}
    >
      <Icon name={item.icon} size={30} color="#004158" />
      <Text style={styles.quickAccessButtonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.welcomeText}>
              {userName ? `Welcome, ${userName}!` : "Welcome!"}
            </Text>

            <Text style={styles.sectionTitle}>Assigned Volunteers</Text>
            {loading && <ActivityIndicator size="large" color="#004158" />}
          </>
        }
        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <FlatList
              data={drawerLinks}
              renderItem={renderQuickAccessItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={styles.quickAccessContainer}
              scrollEnabled={false}
            />
          </>
        }
        data={loading ? [] : volunteers}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/supervisor/volunteerDetails",
              params: { volunteerId: item.id },
            }}
            asChild
          >
            <TouchableOpacity style={styles.volunteerCard}>
              <Text style={styles.volunteerName}>👤   {item.name}</Text>
              <Text
                style={styles.volunteerEmail}
                onPress={() => Linking.openURL(`mailto:${item.email}`)}
              >
                📧    {item.email}
              </Text>
              <Text
                style={styles.volunteerEmail}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                📞   {item.phone}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedContainer}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "Login", params: { supervisorId: userId } })
          }
        >
          <Ionicons name="home-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/supervisor/notifications",
              params: { supervisorId: userId },
            })
          }
        >
          <Ionicons name="notifications-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/supervisor/profiles",
              params: { supervisorId: userId },
            })
          }
        >
          <Ionicons name="person-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/supervisor/help",
              params: { supervisorId: userId },
            })
          }
        >
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
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#004158",
  },
  volunteerCard: {
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004158",
    marginBottom: 4,
  },
  volunteerEmail: {
    fontSize: 14,
    color: "#004158",
    marginBottom: 4,
  },
  quickAccessContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  quickAccessButton: {
    backgroundColor: "#f0f4ff",
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 130,
    maxWidth: "45%",
    shadowColor: "#004158",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  quickAccessButtonText: {
    color: "#004158",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#004158",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    elevation: 5,
  },
});

export default App;
