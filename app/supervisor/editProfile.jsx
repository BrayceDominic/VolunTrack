import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';

const app = () => {
  const [profile, setProfile] = useState({
    email: '',
    organization: '',
    phone: '',
    location: '',
    image: '',
    name: '',
    role: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem('userProfile');
      if (data) {
        setProfile(JSON.parse(data));
      }
    };
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, image: result.assets[0].uri });
    }
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile updated!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri: profile.image || 'https://placeimg.com/140/140/any',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Email"
          value={profile.email}
          onChangeText={(val) => handleChange('email', val)}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Phone"
          value={profile.phone}
          onChangeText={(val) => handleChange('phone', val)}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Organization"
          value={profile.organization}
          onChangeText={(val) => handleChange('organization', val)}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Location"
          value={profile.location}
          onChangeText={(val) => handleChange('location', val)}
          style={styles.input}
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tan',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#004158',
    marginTop: 38,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004158',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#004158',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#004158',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#004158',
  },
  saveButton: {
    backgroundColor: '#004158',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'tan',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
