import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const app = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await AsyncStorage.getItem('notifications');
      setNotifications(data ? JSON.parse(data) : []);
    };
    loadNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>🕓 {item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#004158" />
                </Link>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No notifications yet</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'tan',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004158',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 6,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#004158',
    marginTop: 30,
  },
});

export default app;
