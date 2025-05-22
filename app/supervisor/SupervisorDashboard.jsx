import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Linking,
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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
          `http://192.168.100.47:5050/api/supervisors/${id}/volunteers`
        );
        setVolunteers(res.data);
      } catch (err) {
        console.error("❌ Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const drawerLinks = [
    { icon: "home", title: "Home", route: "/supervisor/SupervisorDashboard" },
    {
      icon: "assignment",
      title: "Projects",
      onPress: () =>
        navigateWithId("/supervisor/projects"),
    },
    {
      icon: "people",
      title: "Attendance",
      onPress: () =>
        navigateWithId("/supervisor/attendance"),
    },
    {
      icon: "task",
      title: "Tasks",
      onPress: () =>
        navigateWithId("/supervisor/tasks"),
    },
    {
      icon: "feedback",
      title: "Feedback",
      onPress: () =>
        navigateWithId("/supervisor/feedbacks"),
    },
    {
      icon: "star",
      title: "Rating",
      onPress: () =>
        navigateWithId("/supervisor/gradingform"),
    },
    {
      icon: "bar-chart",
      title: "Statistics",
      onPress: () =>
        navigateWithId("/supervisor/gradeschart"),
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

  const navigateWithId = async (pathname) => {
    const id = await AsyncStorage.getItem("userId");
    router.push({ pathname, params: { id, role: "supervisor" } });
  };

  const filteredLinks = drawerLinks.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderQuickAccessItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quickAccessButton}
      onPress={item.onPress || (() => router.push(item.route))}
    >
      <Icon name={item.icon} size={30} color="#004158" />
      <Text style={styles.quickAccessButtonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.notificationIcon}
              onPress={() =>
                router.push({
                  pathname: "/supervisor/notifications",
                  params: { supervisorId: userId },
                })
              }
            >
              <Ionicons name="notifications-outline" size={28} color="#004158" />
            </TouchableOpacity>

            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeText}>
                {userName ? `Welcome, ${userName}!` : "Welcome!"}
              </Text>
            </View>

            <TextInput
              placeholder="Search Quick Access..."
              placeholderTextColor="#555"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchBar}
            />

            <Text style={styles.sectionTitle}>Assigned Volunteers</Text>
            {loading && <ActivityIndicator size="large" color="#004158" />}
          </View>
        }
        ListFooterComponent={
          <View>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <FlatList
              data={filteredLinks}
              renderItem={renderQuickAccessItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={styles.quickAccessContainer}
              scrollEnabled={false}
            />
          </View>
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
              <Text style={styles.volunteerName}>👤 {item.name}</Text>
              <Text
                style={styles.volunteerEmail}
                onPress={() => Linking.openURL(`mailto:${item.email}`)}
              >
                📧 {item.email}
              </Text>
              <Text
                style={styles.volunteerEmail}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                📞 {item.phone}
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
          <Ionicons name="help-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "tan" },
  feedContainer: { padding: 16, paddingBottom: 100 },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    borderColor: "#004158",
    borderWidth: 1,
  },
  welcomeCard: {
    backgroundColor: "#004158",
    marginHorizontal: 19,
    marginTop: 34,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 5,
    color: "#004158",
    textAlign: "center",
  },
  volunteerCard: {
    backgroundColor: "#f0f4ff",
    padding: 10,
    borderRadius: 15,
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
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  quickAccessButton: {
    backgroundColor: "#f0f4ff",
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 130,
    maxWidth: "45%",
    shadowColor: "#004158",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
  notificationIcon: {
    position: "absolute",
    top: -10,
    left: 340,
    zIndex: 10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 50,
    elevation: 3,
  },
});

export default App;
